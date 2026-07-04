import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}
interface State {
  hasError: boolean;
  message: string;
}

// 简易错误边界：捕获子树渲染异常，避免整页白屏
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: "" };

  static getDerivedStateFromError(err: unknown): State {
    return {
      hasError: true,
      message: err instanceof Error ? err.message : String(err),
    };
  }

  componentDidCatch(err: unknown) {
    console.error("ErrorBoundary caught:", err);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="min-h-screen flex flex-col items-center justify-center bg-canvas p-6 text-center">
            <div className="text-4xl mb-3">😵</div>
            <h1 className="text-lg font-semibold text-ink mb-2">页面渲染出错</h1>
            <p className="text-xs text-muted mb-4 break-all max-w-md">
              {this.state.message || "未知错误"}
            </p>
            <button
              onClick={() => (window.location.href = "/")}
              className="px-4 py-2 bg-clay text-white rounded-lg text-sm hover:bg-clay-deep transition-colors"
            >
              返回首页
            </button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
