export const metadata = {
  title: "Visual Marketplace | Gabarito",
};

export default function VisualMarketplacePage() {
  return (
    <main style={{ minHeight: "100vh", background: "#f0f2f5" }}>
      <iframe
        src="/visual-marketplace-loja.html"
        title="Gabarito visual marketplace loja"
        style={{ width: "100%", minHeight: "100vh", border: 0, display: "block" }}
      />
    </main>
  );
}
