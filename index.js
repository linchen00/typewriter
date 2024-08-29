const jsdom = require('jsdom');
const {JSDOM} = jsdom;

class HTMLTypewriter {
    constructor(richText, outputCallback, delay = 100) {
        const dom = new JSDOM(`<!DOCTYPE html><div id="typewriter"></div>`);
        this.document = dom.window.document;
        this.typewriterElement = this.document.getElementById('typewriter');
        this.tree = this.parseHTMLtoTree(richText);
        this.outputCallback = outputCallback;
        this.delay = delay;
    }

    parseHTMLtoTree(htmlString) {
        const template = this.document.createElement('template');
        template.innerHTML = htmlString.trim();
        return template.content;
    }

    async start() {
        await this.typeWriter(this.typewriterElement, this.tree);
        this.outputCallback(this.typewriterElement.innerHTML);
    }

    async typeWriter(element, node) {
        for (let currentNode of node.childNodes) {
            if (currentNode.nodeType === this.document.TEXT_NODE) {
                await this.typeText(element, currentNode.textContent);
            } else if (currentNode.nodeType === this.document.ELEMENT_NODE) {
                const newElement = this.document.createElement(currentNode.tagName.toLowerCase());
                for (let attr of currentNode.attributes) {
                    newElement.setAttribute(attr.name, attr.value);
                }
                element.appendChild(newElement);
                this.outputCallback(this.typewriterElement.innerHTML);
                await this.sleep(this.delay);
                await this.typeWriter(newElement, currentNode);
            }
        }
    }

    async typeText(element, text) {
        for (let char of text) {
            element.appendChild(this.document.createTextNode(char));
            this.outputCallback(this.typewriterElement.innerHTML);
            await this.sleep(this.delay);
        }
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// 使用示例
const richText = `<div style="background: red"><strong>这是粗体字。<a href="https://www.baidu.com">百度</a></strong> <em>这是斜体字。</em> <u>这是下划线字。</u> 打字机特效实现中...</div>`;

const typewriter = new HTMLTypewriter(richText, (html) => {
    console.log(html);
}, 500);

 typewriter.start();