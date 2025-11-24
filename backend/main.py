from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pymysql
from sshtunnel import SSHTunnelForwarder
import contextlib
import json
import os
import secrets
from datetime import datetime, timedelta
from typing import Optional

app = FastAPI()

# Configuración de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permitir todos los orígenes para desarrollo
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Almacenamiento simple de sesiones en memoria (en producción usar Redis o DB)
sessions = {}

# Configuración de Credenciales
SSH_HOST = 'iotnatural.com.ar'
SSH_USER = 'martinpn'
SSH_PASS = 'martinpn2025!'
DB_USER = 'dashboardpx'
DB_PASS = 'dashboardpx2025!'
DB_NAME = 'pn_db'

class UserCheck(BaseModel):
    email: str

class LogoutRequest(BaseModel):
    token: str

@contextlib.contextmanager
def db_connection():
    tunnel = SSHTunnelForwarder(
        (SSH_HOST, 22),
        ssh_username=SSH_USER,
        ssh_password=SSH_PASS,
        remote_bind_address=('127.0.0.1', 3306)
    )
    tunnel.start()
    try:
        connection = pymysql.connect(
            host='127.0.0.1',
            user=DB_USER,
            password=DB_PASS,
            database=DB_NAME,
            port=tunnel.local_bind_port,
            cursorclass=pymysql.cursors.DictCursor
        )
        try:
            yield connection
        finally:
            connection.close()
    finally:
        tunnel.stop()

import json
import os

def get_controllers_data(cursor, user_id):
    # 2. Buscar UserControllers (Relación UserId -> CtrlId)
    cursor.execute("SELECT CtrlId FROM UserControllers WHERE UserId = %s", (user_id,))
    user_controllers_rows = cursor.fetchall()
    ctrl_ids = [row['CtrlId'] for row in user_controllers_rows]

    # 3. Buscar Controllers (Detalles de cada controlador)
    controllers_data = []
    if ctrl_ids:
        format_strings = ','.join(['%s'] * len(ctrl_ids))
        cursor.execute(f"SELECT * FROM Controllers WHERE CtrlId IN ({format_strings})", tuple(ctrl_ids))
        controllers_data = cursor.fetchall()

    # 4. Filtrar campos no deseados
    ctrl_fields_to_remove = [
        "Enabled", "AppType", "SwVersion", "HwVersion", "LocalAccess", 
        "LocalConfigChanged", "RemoteConfigChanged", "LastReport", "TimeZone", 
        "RemoteIp", "RemotePort", "CtrlImage", "CustomImage", "GroupId", 
        "TokenId", "ActivationCode", "CalibrationCode", "EncKey", 
        "ComTimeout", "City", "MacAddress"
    ]

    sensor_fields_to_remove = [
        "EventGeneration", "AlarmGeneration", "ActiveStationRequired", 
        "MatureTime", "DematureTime", "CtrlId", "UpperThEnabled", 
        "BottomThEnabled", "Value", "SlopeFactor", "OffsetFactor", "Units"
    ]
    
    filtered_controllers = []
    for ctrl in controllers_data:
        ctrl_copy = ctrl.copy()
        for field in ctrl_fields_to_remove:
            if field in ctrl_copy:
                del ctrl_copy[field]
        
        cursor.execute("SELECT * FROM Sensors WHERE CtrlId = %s", (ctrl['CtrlId'],))
        sensors_data = cursor.fetchall()
        
        filtered_sensors = []
        for sensor in sensors_data:
            sensor_copy = sensor.copy()
            for field in sensor_fields_to_remove:
                if field in sensor_copy:
                    del sensor_copy[field]
            
            query_val = """
                SELECT Value FROM SensorValues 
                WHERE CtrlId = %s AND SensorId = %s 
                ORDER BY Timestamp DESC LIMIT 1
            """
            cursor.execute(query_val, (ctrl['CtrlId'], sensor['SensorId']))
            val_row = cursor.fetchone()
            
            sensor_copy['Value'] = val_row['Value'] if val_row else None
            
            filtered_sensors.append(sensor_copy)
        
        ctrl_copy['sensors'] = filtered_sensors
        
        # Mapeo de Valores
        status_map = {0: "Desasociado", 1: "Conectado", 2: "Desconectado"}
        model_map = {4: "Pool Xpert R2", 6: "Pool Xpert S2", 8: "Clorador Px", 1: "Cloradores", 2: "Submarino", 9: "Submarino mini"}
        custom_type_map = {0: "Pool Xpert", 1: "Tessel", 2: "Nataclor"}
        indoor_map = {0: "Exterior", 1: "Interior"}
        climatized_map = {0: "No", 1: "Si"}
        water_type_map = {0: "Agua de red", 1: "Agua de pozo"}
        material_type_map = {0: "Desconocido", 1: "Cemento", 2: "Fibra", 3: "Lona", 4: "Otra"}

        ctrl_copy['Status'] = status_map.get(ctrl_copy.get('Status'), ctrl_copy.get('Status'))
        ctrl_copy['Model'] = model_map.get(ctrl_copy.get('Model'), ctrl_copy.get('Model'))
        ctrl_copy['CustomType'] = custom_type_map.get(ctrl_copy.get('CustomType'), ctrl_copy.get('CustomType'))
        ctrl_copy['Indoor'] = indoor_map.get(ctrl_copy.get('Indoor'), ctrl_copy.get('Indoor'))
        ctrl_copy['Climatized'] = climatized_map.get(ctrl_copy.get('Climatized'), ctrl_copy.get('Climatized'))
        ctrl_copy['WaterType'] = water_type_map.get(ctrl_copy.get('WaterType'), ctrl_copy.get('WaterType'))
        ctrl_copy['MaterialType'] = material_type_map.get(ctrl_copy.get('MaterialType'), ctrl_copy.get('MaterialType'))

        filtered_controllers.append(ctrl_copy)
    
    return filtered_controllers

@app.post("/check-user")
def check_user(user: UserCheck):
    try:
        with db_connection() as conn:
            with conn.cursor() as cursor:
                # 1. Buscar Usuario
                cursor.execute("DESCRIBE Users")
                columns = [row['Field'] for row in cursor.fetchall()]
                email_col = next((col for col in columns if 'mail' in col.lower()), None)
                
                if not email_col:
                    raise HTTPException(status_code=500, detail="No se encontró columna de email en Users")
                
                query = f"SELECT * FROM Users WHERE {email_col} = %s"
                cursor.execute(query, (user.email,))
                user_data = cursor.fetchone()
                
                if not user_data:
                    return {"exists": False, "message": "Usuario no encontrado"}

                user_id = user_data['UserId']

                # Obtener datos de controladores usando la función auxiliar
                filtered_controllers = get_controllers_data(cursor, user_id)

                # Filtrar campos no deseados de User
                user_fields_to_remove = [
                    "UserParent", "UserType", "AppType", "City", "State", "Country", 
                    "Birthdate", "LastSession", "TokenId", "Enabled", "Phone", 
                    "ConfirmToken", "ConfirmDate", "RecoverToken", "TimeZone", 
                    "RecoverDate", "Language"
                ]
                for field in user_fields_to_remove:
                    if field in user_data:
                        del user_data[field]

                # 5. Construir Objeto Completo
                full_response = {
                    "user": user_data,
                    "controllers": filtered_controllers
                }

                # 6. Guardar en JSON
                json_path = os.path.join(os.path.dirname(__file__), "user_data.json")
                def json_serial(obj):
                    if hasattr(obj, 'isoformat'):
                        return obj.isoformat()
                    raise TypeError (f"Type {type(obj)} not serializable")

                with open(json_path, "w", encoding='utf-8') as f:
                    json.dump(full_response, f, default=json_serial, indent=4, ensure_ascii=False)

                # Generar token de sesión
                session_token = secrets.token_urlsafe(32)
                sessions[session_token] = {
                    "email": user.email,
                    "user_id": user_id,
                    "created_at": datetime.now(),
                    "expires_at": datetime.now() + timedelta(hours=24)
                }

                return {
                    "exists": True, 
                    "message": "Datos recuperados y guardados exitosamente",
                    "token": session_token,
                    "data": full_response
                }
                    
    except Exception as e:
        print(f"Error: {e}") # Log para debug en consola
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/refresh-data")
def refresh_data(authorization: Optional[str] = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="No se proporcionó token de autorización")
    
    token = authorization.replace("Bearer ", "") if authorization.startswith("Bearer ") else authorization
    
    if token not in sessions:
        raise HTTPException(status_code=401, detail="Sesión inválida o expirada")
    
    session = sessions[token]
    
    if datetime.now() > session["expires_at"]:
        del sessions[token]
        raise HTTPException(status_code=401, detail="Sesión expirada")
    
    user_id = session["user_id"]
    
    try:
        with db_connection() as conn:
            with conn.cursor() as cursor:
                controllers = get_controllers_data(cursor, user_id)
                return {"controllers": controllers}
    except Exception as e:
        print(f"Error refreshing data: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/validate-session")
def validate_session(authorization: Optional[str] = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="No se proporcionó token de autorización")
    
    # Extraer token del header "Bearer <token>"
    token = authorization.replace("Bearer ", "") if authorization.startswith("Bearer ") else authorization
    
    if token not in sessions:
        raise HTTPException(status_code=401, detail="Sesión inválida o expirada")
    
    session = sessions[token]
    
    # Verificar si la sesión ha expirado
    if datetime.now() > session["expires_at"]:
        del sessions[token]
        raise HTTPException(status_code=401, detail="Sesión expirada")
    
    return {
        "valid": True,
        "email": session["email"],
        "user_id": session["user_id"]
    }

@app.post("/logout")
def logout(authorization: Optional[str] = Header(None)):
    if not authorization:
        return {"success": True, "message": "No hay sesión activa"}
    
    token = authorization.replace("Bearer ", "") if authorization.startswith("Bearer ") else authorization
    
    if token in sessions:
        del sessions[token]
    
    return {"success": True, "message": "Sesión cerrada exitosamente"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
