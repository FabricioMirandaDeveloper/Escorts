import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { auth, db } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import departamentosData from "../data/ubigeo_peru_2016_departamentos.json";
import provinciasData from "../data/ubigeo_peru_2016_provincias.json";
import distritosData from "../data/ubigeo_peru_2016_distritos.json"

const PublicarAnuncio = () => {
    const [nombre, setNombre] = useState<string>("");
    const [edad, setEdad] = useState<string>("");
    const [numero, setNumero] = useState<string>("")
    const [descripcion, setDescripcion] = useState<string>("")
    const [imagenes, setImagenes] = useState<File[]>([]);
    const [previas, setPrevias] = useState<string[]>([]);
    const [subiendo, setSubiendo] = useState<boolean>(false);

    const [departamentoId, setDepartamentoId] = useState("");
    const [departamentoNombre, setDepartamentoNombre] = useState("");

    const [provinciaId, setProvinciaId] = useState("")
    const [provinciaNombre, setProvinciaNombre] = useState("")

    const [distritoId, setDistritoId] = useState("");
    const [distritoNombre, setDistritoNombre] = useState("");

    const [provincias, setProvincias] = useState<any[]>([]);
    const [distritos, setDistritos] = useState<any[]>([]);

    useEffect(() => {
        const nuevasPrevias = imagenes.map((imagen) => URL.createObjectURL(imagen));
        setPrevias(nuevasPrevias);

        return () => {
            nuevasPrevias.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [imagenes]);

    useEffect(() => {
        if (departamentoId) {
            const provinciasFiltradas = provinciasData.filter(
                (p) => p.department_id === departamentoId
            );
            setProvincias(provinciasFiltradas);
            setProvinciaId(""); // Reinicia la provincia al cambiar el departamento
            setProvinciaNombre("")
            setDistritoId("");  // Reinicia el distrito
            setDistritoNombre("")
        } else {
            setProvincias([]);
            setDistritos([]);
        }
    }, [departamentoId]);

    useEffect(() => {
        if (provinciaId) {
            const distritosFiltrados = distritosData.filter(
                (d) => d.province_id === provinciaId
            );
            setDistritos(distritosFiltrados);
            setDistritoId(""); // Reinicia el distrito al cambiar la provincia
            setDistritoNombre("")
        } else {
            setDistritos([]);
        }
    }, [provinciaId]);

    const convertirImagenABase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });
    };
    const manejarCambioImagenes = (e: React.ChangeEvent<HTMLInputElement>) => {
        const archivosSeleccionados = Array.from(e.target.files || [])

        // Filtrar archivos duplicados
        const archivosUnicos = archivosSeleccionados.filter(
            (archivo) => !imagenes.some((img) => img.name === archivo.name)
        )

        // Verificar que no supere el límite de 3 imágenes
        if (imagenes.length + archivosUnicos.length > 3) {
            toast.error("Solo puedes subir hasta 3 imágenes.")
            return
        }

        // Agregar nuevas imágenes sin reemplazar las anteriores
        setImagenes((prevImagenes) => [...prevImagenes, ...archivosUnicos])
    }

    const eliminarImagen = (index: number) => {
        setImagenes((prevImagenes) => {
            const nuevasImagenes = prevImagenes.filter((_, i) => i !== index);
            if (nuevasImagenes.length === 0) setPrevias([]); // Limpiar previas solo si no hay imágenes
            return nuevasImagenes;
        });

        setPrevias((prevPrevias) => {
            const nuevasPrevias = prevPrevias.filter((_, i) => i !== index);
            URL.revokeObjectURL(prevPrevias[index]);
            return nuevasPrevias;
        });
    };

    const manejarCambioDescripcion = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const texto = e.target.value;
        if (texto.length <= 200) {
            setDescripcion(texto);
        }
    };

    const manejarFormulario = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const user = auth.currentUser;
        if (!user) {
            toast.error("No estás autenticado. Por favor inicia sesión.");
            return;
        }

        if (!departamentoId || !provinciaId || !distritoId) {
            toast.error("Debes seleccionar tu departamento, provincia y distrito.");
            return;
        }

        if (!nombre || !edad || !numero || imagenes.length < 3 || descripcion.length < 40) {
            toast.error("Debes completar todos los campos, subir al menos 3 imágenes y la descripción debe tener al menos 40 caracteres.");
            return;
        }

        const edadNumero = Number(edad);
        if (isNaN(edadNumero) || edadNumero < 18) {
            toast.error("Debes ser mayor de 18 años para publicar un anuncio.");
            return;
        }

        const numeroPattern = /^9\d{8}$/;
        if (!numeroPattern.test(numero)) {
            toast.error("El número debe ser de 9 dígitos");
            return;
        }

        setSubiendo(true);

        try {
            // Convertir imágenes a Base64
            const imagenesBase64 = await Promise.all(
                imagenes.map(async (imagen) => await convertirImagenABase64(imagen))
            );

            // Guardar en Firestore
            await setDoc(
                doc(db, "usuarios", user.uid),
                {
                    nombre,
                    edad: edadNumero,
                    numero: Number(numero),
                    descripcion,
                    email: user.email,
                    imagenes: imagenesBase64,
                    actualizado: new Date(),
                    departamento: departamentoNombre,
                    provincia: provinciaNombre,
                    distrito: distritoNombre,
                },
                { merge: true }
            );
            toast.success("Información guardada correctamente");
            setNombre("");
            setEdad("");
            setNumero("");
            setDescripcion("");
            setImagenes([]);
            setPrevias([]);
            setDepartamentoId("");
            setDepartamentoNombre("");
            setProvinciaId("");
            setProvinciaNombre("");
            setDistritoId("");
            setDistritoNombre("");
        } catch (error) {
            console.error("Error al subir imágenes o guardar datos: ", error);
            toast.error("Hubo un error al guardar la información.");
        } finally {
            setSubiendo(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#101828] p-4">
            <div className="w-full max-w-md bg-gray-700 p-6 rounded shadow">
                <h2 className="text-2xl font-bold text-center mb-4">
                    PUBLICAR ANUNCIO
                </h2>
                <h3 className="text-center text-sm font-medium">
                    Completa la información requerida para poder publicar tu anuncio.
                </h3>
                <form onSubmit={manejarFormulario} className="space-y-4 mt-6">
                    <div>
                        <label htmlFor="nombre" className="block text-white">
                            Nombre:
                        </label>
                        <input
                            type="text"
                            id="nombre"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            className="mt-1 block w-full p-2 rounded text-black"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="edad" className="block text-white">
                            Edad:
                        </label>
                        <input
                            type="number"
                            id="edad"
                            value={edad}
                            onChange={(e) => setEdad(e.target.value)}
                            className="mt-1 block w-full p-2 rounded text-black"
                            min="18"
                            max="99"
                            required
                            onInvalid={(e) =>
                                e.currentTarget.setCustomValidity("Debes ser mayor de 18 años para publicar un anuncio")
                            }
                            onInput={(e) => e.currentTarget.setCustomValidity("")}
                        />
                    </div>
                    <div>
                        <label htmlFor="numero" className="block text-white">
                            Número de celular:
                        </label>
                        <input
                            type="tel"
                            id="numero"
                            value={numero}
                            onChange={(e) => setNumero(e.target.value)}
                            className="mt-1 block w-full p-2 rounded text-black"
                            required
                            pattern="^9\d{8}$"
                            onInvalid={(e) =>
                                e.currentTarget.setCustomValidity("El número debe ser de 9 dígitos")
                            }
                            onInput={(e) => e.currentTarget.setCustomValidity("")}
                        />
                    </div>
                    <div>
                        <label htmlFor="descripcion" className="block text-white">
                            Descripción breve (40-200 caracteres):
                        </label>
                        <textarea
                            id="descripcion"
                            value={descripcion}
                            onChange={manejarCambioDescripcion}
                            className="mt-1 block w-full p-2 rounded text-black resize-none"
                            rows={3}
                            required
                            placeholder="Escribe una descripción breve sobre ti (mínimo 40 caracteres)"
                        />
                        <p className="text-sm text-gray-300 mt-1">
                            {descripcion.length} / 200 caracteres
                        </p>
                    </div>
                    <div>
                        <label htmlFor="departamento" className="block text-white">
                            Departamento:
                        </label>
                        <select
                            id="departamento"
                            value={departamentoId}
                            onChange={(e) => {
                                const selectedDepartment = departamentosData.find(dep => dep.id === e.target.value);
                                if (selectedDepartment) {
                                    setDepartamentoId(selectedDepartment.id);
                                    setDepartamentoNombre(selectedDepartment.name);
                                } else {
                                    setDepartamentoId("");
                                    setDepartamentoNombre("");
                                }
                            }}
                            className="mt-1 block w-full p-2 rounded text-black"
                            required
                        >
                            <option value="">Selecciona un departamento</option>
                            {departamentosData.map(dep => (
                                <option key={dep.id} value={dep.id}>
                                    {dep.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="provincia" className="block text-white">
                            Provincia:
                        </label>
                        <select
                            id="provincia"
                            value={provinciaId}
                            onChange={(e) => {
                                const selectedProvince = provincias.find((p) => p.id === e.target.value);
                                if (selectedProvince) {
                                    setProvinciaId(selectedProvince.id);
                                    setProvinciaNombre(selectedProvince.name);
                                } else {
                                    setProvinciaId("");
                                    setProvinciaNombre("");
                                }
                            }}
                            className="mt-1 block w-full p-2 rounded text-black"
                            required
                            disabled={!departamentoId}
                        >
                            <option value="">Selecciona una provincia</option>
                            {provincias.map(prov => (
                                <option key={prov.id} value={prov.id}>
                                    {prov.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="distrito" className="block text-white">
                            Distrito:
                        </label>
                        <select
                            id="distrito"
                            value={distritoId}
                            onChange={(e) => {
                                const selectedDistrict = distritos.find((d) => d.id === e.target.value);
                                if (selectedDistrict) {
                                    setDistritoId(selectedDistrict.id);
                                    setDistritoNombre(selectedDistrict.name);
                                } else {
                                    setDistritoId("");
                                    setDistritoNombre("");
                                }
                            }}
                            className="mt-1 block w-full p-2 rounded text-black"
                            disabled={!provinciaId}
                            required
                        >
                            <option value="">Selecciona un distrito</option>
                            {distritos.map((d) => (
                                <option key={d.id} value={d.id}>
                                    {d.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="imagenes" className="block text-white">
                            Subir Imágenes (mínimo 3):
                        </label>
                        <input
                            type="file"
                            id="imagenes"
                            accept="image/*"
                            multiple
                            onChange={manejarCambioImagenes}
                            className="mt-1 block w-full p-2 rounded bg-white text-black"
                        />
                    </div>

                    {/* Vista previa de imágenes */}
                    {previas.length > 0 && (
                        <div className="mt-4 flex gap-2 flex-wrap">
                            {previas.map((src, index) => (
                                <div key={index} className="relative">
                                    <img
                                        src={src}
                                        alt={`Vista previa ${index + 1}`}
                                        className="w-24 h-24 object-cover rounded-md border border-gray-300"
                                    />
                                    {/* Botón para eliminar la imagen */}
                                    <button
                                        onClick={() => eliminarImagen(index)}
                                        type="button"
                                        className="absolute top-0 right-0 flex items-center justify-center  bg-red-500 text-white text-xs rounded-full w-6 h-6"
                                    >
                                        <FontAwesomeIcon icon={faTimes} className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={subiendo}
                        className="w-full flex justify-center rounded-md px-3 py-2 font-semibold text-white bg-[#EA580C] hover:bg-[#FF6B35]"
                    >
                        {subiendo ? "Subiendo..." : "Publicar Anuncio"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PublicarAnuncio;

