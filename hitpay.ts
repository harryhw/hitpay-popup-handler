function HitPay() {
    let isLoaded: boolean = false;
    let iframe: HTMLIFrameElement | null = null;
    let readyPromise: Promise<void> | null = null;
    let readyResolve: (() => void) | null = null;
    let bodyOverflow: string = "visible";

    interface InitOptions {
        scheme?: string;
        domain?: string;
        path?: string;
    }

    interface Callbacks {
        onClose?: () => void;
        onSuccess?: () => void;
        onError?: (error: any) => void;
    }

    interface Config {
        visible: boolean;
        defaultUrl: string;
        initOptions: InitOptions;
        callbacks: Callbacks;
        checkoutOptions: Record<string, any>;
    }

    const config: Config = {
        visible: false,
        defaultUrl: "",
        initOptions: { scheme: "", domain: "" },
        callbacks: { onClose: undefined, onSuccess: undefined, onError: undefined },
        checkoutOptions: {}
    };

    const HitPay = {
        async init(defaultUrl: string, initOptions: InitOptions = {}) {
            if (!isLoaded) {
                config.defaultUrl = defaultUrl;
                config.initOptions = initOptions;
                

                const scheme = initOptions.scheme || "https";
                const domain = initOptions.domain || "hit-pay.com";
                const path = initOptions.path || "";
                
                if (document.getElementById("hitpay-overlay")) {
                    const currentIframe = document.getElementById("hitpay-overlay") as HTMLIFrameElement;
                    currentIframe.parentNode?.removeChild(currentIframe);
                }

                iframe = document.createElement("iframe");
                iframe.setAttribute("src", `${scheme}://${domain}${path}/hitpay-iframe.html`);
                iframe.setAttribute("allow", "payment");
                iframe.setAttribute("id", "hitpay-overlay");
                iframe.style.position = "fixed";
                iframe.style.border = "0";
                iframe.style.width = "100vw";
                iframe.style.height = "100vh";
                iframe.style.margin = "0";
                iframe.style.padding = "0";
                iframe.style.zIndex = "99999999";
                iframe.style.top = "0";
                iframe.style.left = "0";
                iframe.style.display = "none";

                document.body.appendChild(iframe);
            
                

                readyPromise = new Promise<void>((resolve) => {
                    readyResolve = resolve;
                });
            }
        },

        async toggle(checkoutOptions: Record<string, any>, callbacks: Callbacks = {}) {
            config.callbacks = callbacks;
            
            if (readyPromise) {
                await readyPromise;
            }

            if (config.visible) {
                document.body.style.overflow = bodyOverflow;
            } else {
                bodyOverflow = document.body.style.overflow;
                document.body.style.overflow = "hidden";
                if (iframe) iframe.style.display = "block";
            }

            const timeout = config.visible ? 0 : 500;
            setTimeout(() => {
                iframe?.contentWindow?.postMessage({
                    type: "toggle",
                    props: {
                        defaultUrl: config.defaultUrl,
                        ...config.initOptions,
                        checkoutOptions
                    }
                }, "*");

                config.visible = !config.visible;

                if (!config.visible) {
                    if (iframe) iframe.style.display = "none";
                    if (config.callbacks.onClose) {
                        config.callbacks.onClose();
                    }
                }
            }, timeout);
        },

        async close() {
            config.visible = false;
            if (iframe) iframe.style.display = "none";
            if (config.callbacks.onClose) {
                config.callbacks.onClose();
            }
        },
        destroy() {
            if (document.getElementById("hitpay-overlay")) {
                const currentIframe = document.getElementById("hitpay-overlay") as HTMLIFrameElement;
                currentIframe.parentNode?.removeChild(currentIframe);
            }
        }
    };

    const handleMessage = (event: MessageEvent) => {
        if (event.data) {
            switch (event.data.type) {
                case "loaded":
                    readyPromise = null;
                    if (readyResolve) {
                        isLoaded = true;
                        readyResolve();
                    }
                    break;
                case "toggle":
                    HitPay.toggle({});
                    break;
                case "close":
                    HitPay.destroy();
                    break;
                case "destroy":
                    HitPay.close();
                    break;
                case "success":
                    if (config.callbacks.onSuccess) {
                        config.callbacks.onSuccess();
                    }
                    break;
                case "error":
                    console.log("hitpay ERROOOOOOOOOOR")
                    if (config.callbacks.onError) {
                        config.callbacks.onError(event.data.error);
                    }
                    break;
            }
        }
    };

    window.addEventListener("message", handleMessage);
    return HitPay;
}

export default HitPay;
