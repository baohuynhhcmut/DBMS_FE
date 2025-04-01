import { footerConfig } from "../config/footer-top-config";
import Container from "./Container";


const FooterTop = () => {


    return (
        <Container className="py-0">
            <div className="bg-gray-100 max-w-6xl mx-auto px-10 py-10 rounded-md">
                <h2 className="text-center font-bold text-3xl">Meow electronics built our bussiness on customer devices</h2>
                <div className="flex md:flex-row items-center flex-col py-4 gap-10">
                    {footerConfig.map((item) => (
                        <>
                            <div className="flex flex-col justify-center items-center max-w-[350px] break-words">
                                <div className="text-[56px]">
                                    {item.imageSrc}
                                </div>  
                                <p>{item.name}</p>
                                <p className="text-sm text-gray-500">{item.description}</p>
                            </div>
                        </>
                    ))}
                </div>
            </div>
        </Container>
    );
}

export default FooterTop;
