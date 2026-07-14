import Sidebar from "./Sidebar";
import Header from "./Header";

function MainLayout({ children }) {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div
        style={{
          marginLeft: "250px",
          width: "100%",
          minHeight: "100vh",
          background: "#f8fafc",
        }}
      >
        <Header />

        <main style={{ padding: "30px" }}>
          {children}
        </main>
      </div>
    </div>
  );
}

export default MainLayout;