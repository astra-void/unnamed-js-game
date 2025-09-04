export abstract class DOMUIComponent {
    element: HTMLElement;

    constructor(tag: string, className?: string) {
        this.element = document.createElement(tag);
        if (className) this.element.className = className;
        document.body.appendChild(this.element);
    }

    abstract update(dt: number): void;

    show() {
        this.element.style.display = "block";
    }

    hide() {
        this.element.style.display = "none";
    }
}