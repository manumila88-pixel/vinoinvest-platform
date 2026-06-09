import { Component } from "react";
import { reportError } from "../lib/errorReporting";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    reportError(error, { componentStack: info?.componentStack });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: "24px 32px",
          margin: "16px 0",
          background: "var(--vi-bg)",
          border: "1px solid rgba(248,113,113,0.2)",
          borderRadius: "var(--vi-radius-md)",
          color: "var(--vi-negative)",
          fontSize: 13,
        }}>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Qualcosa è andato storto</div>
          <div style={{ color: "var(--vi-text-dim)", fontSize: 12 }}>{this.state.error?.message}</div>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{ marginTop: 12, padding: "6px 16px", background: "var(--vi-bg-elev)", border: "none", borderRadius: "var(--vi-radius-sm)", color: "var(--vi-text-dim)", cursor: "pointer", fontSize: 12 }}
          >Riprova</button>
        </div>
      );
    }
    return this.props.children;
  }
}
