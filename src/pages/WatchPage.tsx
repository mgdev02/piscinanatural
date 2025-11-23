import { piscinas } from '../data/piscinas';
import { PiscinaGrid } from '../components/PiscinaGrid';

export const WatchPage = () => {
    return (
        <div className="app-container">
            <PiscinaGrid piscinas={piscinas} />
        </div>
    );
};
