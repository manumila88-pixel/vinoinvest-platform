import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("[ErrorBoundary]", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: "24px 32px",
          margin: "16px 0",
          background: "#0b1220",
          border: "1px solid #ef444433",
          borderRadius: 14,
          color: "#f87171",
          fontSize: 13,
        }}>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Qualcosa è andato storto</div>
          <div style={{ color: "#64748b", fontSize: 12 }}>{this.state.error?.message}</div>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{ marginTop: 12, padding: "6px 16px", background: "#1e293b", border: "none", borderRadius: 8, color: "#94a3b8", cursor: "pointer", fontSize: 12 }}
          >Riprova</button>
        </div>
      );
    }
    return this.props.children;
  }
}
