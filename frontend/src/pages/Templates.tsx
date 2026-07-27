import { useEffect } from "react";
import NewTemplateForm from "../components/NewTemplateForm";

export default function Templates() {

    async function getTemplates() {
        const response = await fetch("http://localhost:8080/templates");
        const data = await response.json();
        console.log(data);
    }
    useEffect(() => {
        getTemplates();
    }, []);
    return <section>
        <h1>Templates</h1>
        <div>
            <NewTemplateForm />
        </div>
    </section>
}