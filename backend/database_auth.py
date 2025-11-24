import pymysql
from sshtunnel import SSHTunnelForwarder
import hashlib
import sys

# Configuración de Credenciales
SSH_HOST = 'iotnatural.com.ar'
SSH_USER = 'martinpn'
SSH_PASS = 'martinpn2025!'
DB_USER = 'dashboardpx'
DB_PASS = 'dashboardpx2025!'
DB_NAME = 'pn_db'

def verificar_login_db(usuario_input, password_input):
    print(f"\n--- Iniciando proceso de autenticación ---")
    print(f"1. Estableciendo túnel SSH con {SSH_HOST}...")
    
    try:
        # Establecer el túnel SSH
        with SSHTunnelForwarder(
            (SSH_HOST, 22),
            ssh_username=SSH_USER,
            ssh_password=SSH_PASS,
            remote_bind_address=('127.0.0.1', 3306)
        ) as tunnel:
            print(f"   -> Túnel OK (Puerto local: {tunnel.local_bind_port})")
            
            print(f"2. Conectando a MySQL (Base de datos: {DB_NAME})...")
            connection = pymysql.connect(
                host='127.0.0.1',
                user=DB_USER,
                password=DB_PASS,
                database=DB_NAME,
                port=tunnel.local_bind_port,
                cursorclass=pymysql.cursors.DictCursor
            )
            print("   -> Conexión a BD exitosa")
            
            try:
                with connection.cursor() as cursor:
                    # PASO A: Exploración (Solo para ver qué tablas hay)
                    print("\n[INFO] Tablas disponibles en la base de datos:")
                    cursor.execute("SHOW TABLES")
                    tables = cursor.fetchall()
                    for table in tables:
                        print(f" - {list(table.values())[0]}")

                    # PASO B: Lógica de Login (ADAPTAR SEGÚN EL NOMBRE REAL DE LA TABLA)
                    # Supongamos que la tabla se llama 'usuarios' y tiene columnas 'email' y 'password'
                    # Como no sé el nombre exacto, haré una consulta genérica o pediré al usuario que revise la salida anterior.
                    
                    print("\n[ATENCIÓN] Necesito saber el nombre de la tabla de usuarios y las columnas.")
                    print("Por ahora, simularé el hash de tu entrada:")
                    
                    # Hashear la entrada (asumiendo SHA1 como vimos antes, o SHA256)
                    hash_input = hashlib.sha1(password_input.encode('utf-8')).hexdigest()
                    print(f"Password ingresada: {password_input}")
                    print(f"Hash generado (SHA-1): {hash_input}")
                    
                    print("\nPara completar el login real, necesito que me digas:")
                    print("1. ¿Cuál de las tablas de arriba es la de usuarios?")
                    print("2. ¿Qué columnas tiene? (ej: id, email, password_hash)")
                    
            finally:
                connection.close()
                
    except Exception as e:
        print(f"\n[ERROR] Falló la conexión: {e}")

if __name__ == "__main__":
    if len(sys.argv) > 2:
        user = sys.argv[1]
        pwd = sys.argv[2]
    else:
        # Valores por defecto para prueba rápida
        user = "admin"
        pwd = "password123"
    
    verificar_login_db(user, pwd)
