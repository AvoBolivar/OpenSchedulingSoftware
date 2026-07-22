import ClientsList from "../components/clientsList/clientsList";
import CreateClient from "../components/clientsList/createClient";
import "./pages.css";

export default function ClientsPage() {
  return (
    <div className="page">
      <header className="page__header">
        <h1 className="page__title">Clients</h1>
        <p className="page__subtitle">Your client directory</p>
      </header>

      <section className="section">
        <span className="section__label">Directory</span>
        <div className="panel">
          <ClientsList />
        </div>
        <hr className="divider" />
        <CreateClient />
      </section>
    </div>
  )
}