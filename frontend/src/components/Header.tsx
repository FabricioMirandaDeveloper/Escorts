import { faFire } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";

export default function Header() {
    const navigate = useNavigate()
    return (
        <header className="bg-[#101828] px-4 py-2 flex justify-between items-center">
            <div className="flex justify-start items-center font-bold text-2xl">
                <h1 className="text-white mr-2">PROYECTO</h1>
                <FontAwesomeIcon icon={faFire} className="text-orange-600" />
            </div>
            <div>
                <button className="bg-[#EA580C] p-1.5 rounded-lg text-xs font-medium" onClick={() => navigate("/registro")}>Publicar anuncio</button>
            </div>
        </header>
    )
}