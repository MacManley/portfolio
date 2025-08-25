import './Dropdown.css';
import '../index.css'
import { techIconMap, statusLabels, statusColorMap } from '../data/projectsData';

function Status({ selectedStatus, setSelectedStatus }) {

    return (
        <>
        {statusLabels.map((state, index) => (
            <div className="dropdown" key={state}>
            <button
            className="button-main"
            onClick={() =>
              setSelectedStatus(selectedStatus === state ? null : state)
            }
            style={{
              backgroundColor: selectedStatus === state ? statusColorMap[index] : "black",
            }}
          >
                <span>{state}</span><span> {techIconMap[state]}</span></button>
            </div>
        )
        )}
        </>
    );
}

export default Status;