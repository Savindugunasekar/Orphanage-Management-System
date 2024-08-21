import ChildTableRow from "./ChildTableRow"
import { useNavigate, useParams } from "react-router-dom"

const ChildTable = ({ children }) => {
    const navigate = useNavigate();
    const { id } = useParams();

    const handleViewChild = (child) => {
        navigate(`/orphanage/${id}/child/${child.childid}`);
    }

    return (
        <div
            className="rounded-sm border bg-white px-5 pb-2.5 pt-6 shadow-default mb-5 sm:px-7.5 xl:pb-1 min-h-screen"
        >
            <h4 className="mb-6 text-xl font-bold text-black ">
                Children
            </h4>

            <div className="flex flex-col">
                <div
                    className="grid grid-cols-3 rounded-sm"
                >
                    <div className="p-2.5 xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base ">Name</h5>
                    </div>
                    <div className="p-2.5 text-center xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">Gender</h5>
                    </div>
                    <div className="p-2.5 text-center xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">Age</h5>
                    </div>

                </div>
                {children.map((child) => (
                    <div key={child.childid} onClick={() => handleViewChild(child)}>
                        <ChildTableRow
                            name={child.name}
                            age={child.age}
                            gender={child.gender}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ChildTable