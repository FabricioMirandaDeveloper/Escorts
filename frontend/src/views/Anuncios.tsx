import { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";

// Interfaz para tipar el anuncio (ajústala según tus necesidades)
interface Anuncio {
    id: string;
    nombre: string;
    edad: number;
    numero: number;
    descripcion: string;
    email: string;
    imagenes: string[];
    actualizado: any;
}

const Anuncios = () => {
    const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
    const [cargando, setCargando] = useState<boolean>(true);

    useEffect(() => {
        const obtenerAnuncios = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "usuarios"));
                const anunciosData: Anuncio[] = querySnapshot.docs.map((doc) => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        nombre: data.nombre,
                        edad: data.edad,
                        numero: data.numero,
                        descripcion: data.descripcion,
                        email: data.email,
                        imagenes: data.imagenes,
                        actualizado: data.actualizado,
                    };
                });
                setAnuncios(anunciosData);
            } catch (error) {
                console.error("Error al obtener anuncios:", error);
            } finally {
                setCargando(false);
            }
        };

        obtenerAnuncios();
    }, []);

    if (cargando) {
        return <p>Cargando anuncios...</p>;
    }

    return (
        <div className="grid grid-cols-2 gap-2 p-2">
            {anuncios.map((anuncio) => (
                <div key={anuncio.id} className="bg-white text-black shadow rounded-lg">
                    {/* Mostrar solo la primera imagen si existe */}
                    {anuncio.imagenes && anuncio.imagenes.length > 0 && (
                        <img
                            src={anuncio.imagenes[0]}
                            alt={`${anuncio.nombre} - imagen`}
                            className="w-full h-64 object-cover rounded-t-lg"
                        />
                    )}
                    <div className="p-2">
                        <h2 className="text-xl font-bold mb-2">{anuncio.nombre}, 
                            <span className=""> {anuncio.edad} años</span>
                        </h2>
                        <p className="mb-2 text-xs">{anuncio.descripcion}</p>
                    </div>

                </div>
            ))}
        </div>
    );
};

export default Anuncios;
