import { FileDrop } from "react-file-drop";
import DropProgress from "@/components/ui/drop-progress";
import { useState, useEffect, useRef, ChangeEvent } from "react";

interface MaterialFiles {
    name: string;
    body: any;
    icon: string;
}

const singleFileUpload = async (file: MaterialFiles) => {
    const response = await fetch(
        `/api/file-upload?filename=${file.name}`,
        {
            method: 'POST',
            body: file.body,
        },
    );
    const { url } = await response.json();
    return url;
};

interface FileUploadProps {
    onFilesUploaded: (urls: string[]) => void;
}

const FileUpload = ({ onFilesUploaded }: FileUploadProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const [frameProp, setFrameProp] = useState<HTMLDocument | undefined>(undefined);
    const [materialFiles, setMaterialFiles] = useState<MaterialFiles[]>([]);

    const filePicker = () => {
        inputRef.current?.click();
    };

    useEffect(() => {
        // Update the frameProp state variable when the component mounts (client-side only)
        setFrameProp(document);
    }, []);

    const fileHandler = async (files: FileList | null) => {
        if (!files || files.length === 0) return;

        const validFiles = Array.from(files).filter(file => {
            const extension = file.name.split(".").pop()?.toLowerCase();
            const allowedExtensions = ["pdf", "md", "txt", "docx"];

            if (!extension || !allowedExtensions.includes(extension)) {
                alert("File type not supported. Only .pdf, .md, .txt, and .docx files are allowed.");
                return false;
            }

            if (file.size > 512 * 1024 * 1024) {
                alert("File size exceeds the 512MB limit");
                return false;
            }

            return true;
        });

        const materialFiles = validFiles.map(file => ({
            name: file.name.length > 50 ? file.name.slice(0, 15) + '...' + file.name.split(".").pop()?.trim() : file.name,
            body: file,
            icon: file.name.split(".").pop()?.toUpperCase().trim() || ""
        }));

        setMaterialFiles(prev => [...prev, ...materialFiles]);
        setLoading(true);
        setError(false);

        try {
            const results = await Promise.all(materialFiles.map((materialFile) => singleFileUpload(materialFile)));
            onFilesUploaded(results);
            setLoading(false);
        } catch (error) {
            setLoading(false);
            setError(true);
        }
    };

    return (
        <>
            <div className="">
                {materialFiles.map((materialFile, index) => (
                    <DropProgress
                        key={index}
                        name={materialFile.name}
                        icon={materialFile.icon}
                        loading={loading}
                        error={error}
                    />
                ))}
            </div>
            {frameProp && (
                <FileDrop
                    frame={frameProp}
                    onTargetClick={filePicker}
                    onDrop={files => fileHandler(files)}
                >
                    <div className="h-52 border rounded-lg flex flex-col justify-center items-center text-gray-800 cursor-pointer transition-opacity hover:opacity-70">
                        <p className="text-center text-sm text-gray-500 block">
                            Drag file here or <span className="text-blue-500 cursor-pointer underline">browse files</span>
                        </p>
                        <p className="text-center text-xs font-bold mt-1 text-gray-500">
                            Up to 512MB each. Text files only (.pdf, .docx, .md, .txt).
                        </p>
                    </div>
                    <input
                        accept=".pdf, .md, .txt, .docx"
                        className="absolute w-0 h-0 opacity-0"
                        ref={inputRef}
                        multiple
                        type="file"
                        onChange={(e: ChangeEvent<HTMLInputElement>) => fileHandler(e.target.files)}
                    />
                </FileDrop>
            )}
        </>
    );
};

export { FileUpload };