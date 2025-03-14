import { useState, useEffect } from "react";
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { Link, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import Slider from "react-slick";
import { faArrowLeft, faArrowRight, faXmark } from "@fortawesome/free-solid-svg-icons";

// Interfaz para tipar el anuncio (ajústala según tus necesidades)
interface Anuncio {
    id: string;
    nombre: string;
    edad: number;
    numero: number;
    descripcion: string;
    texto: string
    tarifas?: { descripcion: string; precio: number }[]
    email: string;
    imagenes: string[];
    distrito: string;
    departamento: string;
}

interface ArrowProps {
    onClick?: React.MouseEventHandler<HTMLDivElement>;
}

const AnuncioDetalle = () => {
    const { id } = useParams<{ id: string }>();
    const [anuncio, setAnuncio] = useState<Anuncio | null>(null);
    const [cargando, setCargando] = useState<boolean>(true);

    useEffect(() => {
        const obtenerAnuncio = async () => {
            try {
                const docRef = doc(db, "usuarios", id!);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setAnuncio({ id: docSnap.id, ...docSnap.data() } as Anuncio);
                } else {
                    console.log("No se encontró el anuncio");
                }
            } catch (error) {
                console.error("Error al obtener el anuncio:", error);
            } finally {
                setCargando(false);
            }
        };

        obtenerAnuncio();
    }, [id]);

    if (cargando) {
        return <p>Cargando anuncio...</p>;
    }

    if (!anuncio) {
        return <p>No se encontró el anuncio.</p>;
    }

    // Flechas personalizadas
    const PrevArrow: React.FC<ArrowProps> = ({ onClick }) => (
        <div
            className="absolute z-10 w-10 h-10 left-0 bottom-2 text-white bg-[#CC3C39] rounded-e-lg flex items-center justify-center cursor-pointer"
            onClick={onClick}
        >
            <FontAwesomeIcon icon={faArrowLeft} className="text-3xl rounded-e-lg"/>
        </div>
    );

    const NextArrow: React.FC<ArrowProps> = ({ onClick }) => (
        <div
            className="absolute z-10 w-10 h-10 right-0 bottom-2 text-white bg-[#CC3C39] rounded-s-lg flex items-center justify-center cursor-pointer"
            onClick={onClick}
        >
            <FontAwesomeIcon icon={faArrowRight} className="text-3xl" />
        </div>
    );

    // Configuración del Slider
    const sliderSettings = {
        dots: false,          // Mostrar puntos de navegación
        infinite: true,      // Desplazamiento infinito
        speed: 500,          // Velocidad de transición
        slidesToShow: 1,     // Mostrar solo una imagen por vez
        slidesToScroll: 1,   // Desplazar una imagen a la vez
        autoplay: true,      // Autoplay para cambiar automáticamente de imagen
        autoplaySpeed: 5000, // Intervalo de tiempo entre las transiciones
        prevArrow: <PrevArrow />,
        nextArrow: <NextArrow />,
    };

    return (
        <div className="bg-white text-[#101828]">
            {/* Botón de cerrar / regresar a anuncios */}
            <Link to="/" className="fixed z-10 top-0 right-0 w-10 h-10 flex justify-center items-center bg-[#CC3C39] rounded-es-lg bg-opacity-80">
                <FontAwesomeIcon icon={faXmark} className="text-3xl text-white" />
            </Link>

            {/* Mostrar imagen ampliada (o un slider si hay varias imágenes) */}
            {anuncio.imagenes && anuncio.imagenes.length > 0 && (
                <Slider {...sliderSettings}>
                    {anuncio.imagenes.map((imagen, index) => (
                        <div key={index} className="h-[480px] min-w-[320px] max-w-[320px]">
                            <img
                                src={imagen}
                                alt={`${anuncio.nombre} - imagen ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ))}
                </Slider>
            )}
            <div className="p-3 space-y-4 text-[#101828]">
                <h2 className="text-xl font-bold mb-2 overflow-hidden">
                    {anuncio.nombre} {anuncio.numero}, {anuncio.descripcion}
                </h2>
                <div className="flex gap-2 flex-wrap text-white">
                    <span className="bg-[#101828] px-2 py-1 rounded-md">{anuncio.departamento}</span>
                    <span className="bg-[#101828] px-2 py-1 rounded-md">{anuncio.distrito}</span>
                    <span className="bg-[#101828] px-2 py-1 rounded-md">{anuncio.edad} años</span>
                    {anuncio.tarifas && anuncio.tarifas.length > 0 && (<span className="bg-[#101828] px-2 py-1 rounded-md">S/. {anuncio.tarifas[0].precio}</span>)}
                </div>
                <div>
                    <p className="text-[#101828] text-lg">{anuncio.texto}</p>
                </div>
                
            </div>
            <div className="p-3 border-gray-200 border-t">
                    <h3 className="text-xl font-bold mb-3">Tarifas</h3>
                    <ul>
                        {anuncio.tarifas?.map((tarifa, index) => (
                            <li key={index} className="flex justify-between items-center">
                                <span>{tarifa.descripcion}</span>
                                <span>S/. {tarifa.precio}</span>
                                
                            </li>
                        ))}
                    </ul>
            </div>
            <div className="p-3 border-gray-200 border-t mb-24">
                <h3 className="text-xl font-bold mb-3">Horario</h3>
            </div>

            {/* Sección de contacto vía WhatsApp */}
            <div className="fixed bottom-0 left-0 right-0 flex justify-center items-center space-x-2 py-3 font-bold bg-[#52CD5F]">
                <FontAwesomeIcon icon={faWhatsapp} className="text-white" style={{ color: "white", fontSize: "30px" }} />
                <a
                    href={`https://wa.me/51${anuncio.numero}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white"
                >
                    Contactar por WhatsApp
                </a>
            </div>
        </div>
    );
};

export default AnuncioDetalle;
