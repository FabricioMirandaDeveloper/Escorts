import { faFire } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Header() {
    return (
        <header className="bg-black px-4 py-2">
            <div className="flex justify-start items-center font-bold text-2xl">
                <h1 className="text-white mr-2">ESCORTS</h1>
                <FontAwesomeIcon icon={faFire} className="text-orange-600" />
            </div>
        </header>
    )
}