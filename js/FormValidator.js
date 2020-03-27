class FormValidator {
    constructor() {
        this.nameInput = this.getInput(NAME_INPUT_ID); 
        this.emailInput = this.getInput(EMAIL_INPUT_ID); 
        this.phoneInput = this.getInput(PHONE_INPUT_ID); 
        this.messageInput = this.getInput(MESSAGE_INPUT_ID); 
        
        this.nameErrorNode = this.getHelpNode(this.nameInput, HELP_BLOCK_QUERY);
        this.emailErrorNode = this.getHelpNode(this.emailInput, HELP_BLOCK_QUERY);
        this.phoneErrorNode = this.getHelpNode(this.phoneInput, HELP_BLOCK_QUERY);
        this.messageErrorNode = this.getHelpNode(this.messageInput, HELP_BLOCK_QUERY);

        this.isListenersSet = false;

        this.addListeners();
    }

    validateMe() {
        let isValid = true;

        isValid &= this.validateName();
        isValid &= this.validateEmail();
        isValid &= this.validatePhone();
        isValid &= this.validateMessage();
        
        return !!isValid;
    }

    validateName() {
        this.clearErrorsNode(this.nameErrorNode);

        let node = this.createErrorsNode();

        const inputValue = this.nameInput.value;        
        
        this.validInputLength(inputValue, {
            minLength: 2,
            message: 'Name is too short',
            node
        });

        this.validInputFormat(inputValue, {
            pattern: /\w\s\w|\w\s\s\s+\w/,
            inverse: true,
            message: 'Name must have explicit 0 or 2 white spaces between words',
            node
        });
        
        if (node.childElementCount > 0) {
            this.nameErrorNode.appendChild(node);
            return false;
        }

        return true;
    }


    validateEmail() {
        this.clearErrorsNode(this.emailErrorNode);

        let node = this.createErrorsNode();

        const inputValue = this.emailInput.value;        

        this.validInputLength(inputValue, {
            minLength: 5,
            maxLength: 50,
            message: 'Email length must be at least 5 and at most 50',
            node
        });
        
        this.validInputFormat(inputValue, {
            pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            message: 'Email format is incorrect',
            node
        });

        if (node.childElementCount > 0) {
            this.emailErrorNode.appendChild(node);
            return false;
        }

        return true;
    }

    validatePhone() {
        this.clearErrorsNode(this.phoneErrorNode);

        let node = this.createErrorsNode();

        const inputValue = this.phoneInput.value;
        
        this.validInputLength(inputValue, {
            minLength: 12,
            message: 'Phone is too short',
            node
        });
    
        this.validInputFormat(inputValue, {
            pattern: /[\+|0]?\d{3}\(?\d{2}\)?[\s|\-]?\d{3}[\s|\-]?\d{3}[\s|\-]?\d{2}/,
            message: 'Phone format is incorrect',
            node
        });
        
        if (node.childElementCount > 0) {
            this.phoneErrorNode.appendChild(node);
            return false;
        }

        return true;
    }

    validateMessage() {
        this.clearErrorsNode(this.messageErrorNode);

        let node = this.createErrorsNode();

        const inputValue = this.messageInput.value;
        
        this.validInputLength(inputValue, {
            minLength: 10,
            message: 'Message is too short',
            node
        });

        this.validInputFormat(inputValue, {
            pattern: /(?:^|\W)(ugly|dumm|stupid|pig|ignorant)(?:$|\W)/i,
            inverse: true,
            message: 'Message must not iclude bad language: ugly, dumm, stupid, pig, ignorant',
            node
        });
        
        if (node.childElementCount > 0) {
            this.messageErrorNode.appendChild(node);
            return false;
        }

        return true;
    }

    validInputLength(value, {
        minLength = null,
        maxLength = null,
        message = null,
        node = null
    }) {
        if (!minLength && !maxLength) {
            throw new Error("FormValidator.validInputLength: ValueError");
        }
        let isValid = true;

        if (minLength !== null) {
            isValid &= value.length >= minLength;
        }
        
        if (maxLength !== null) {
            isValid &= value.length <= maxLength;
        }
 
        if (!isValid && node && message) {
            this.addErrorNode(node, message);
        }

        return isValid;
    }

    validInputFormat(value, {
        pattern = null,
        inverse = false,
        message = null,
        node = null
    }) {
        if (value === null || pattern === null) {
            throw new Error("FormValidator.validInputFormat: ValueError");
        }

        let isValid = !!value.match(pattern);

        if (inverse) isValid = !isValid;

        if (!isValid && node && message) {
            this.addErrorNode(node, message);
        }

        return isValid;
    }

    clearErrorsNode(node) {
        node.innerHTML = '';
    }

    createErrorsNode() {
        let node = document.createElement('ul');
        node.setAttribute('role', 'alert');

        return node;
    }

    addErrorNode(node, message) {
        let li = document.createElement('li');
        li.innerText = message;
        node.appendChild(li);
    }

    getInput(id) {
        const input = document.getElementById(id);

        if (!input) throw new Error(`FormValidator.getInput: Can't find input with id='${id}'`);

        return input;
    }

    getHelpNode(input, query) {
        const node = input.parentNode.querySelector(query);

        if (!node) throw new Error(`FormValidator.getHelpNode: Can't find node with such query='${query}'`);

        return node;
    }

    addListeners() {
        if (this.isListenersSet) return;

        // arrow functions to avoid .bind()
        this.nameInput.addEventListener(   'change', () => this.validateName());
        this.emailInput.addEventListener(  'change', () => this.validateEmail());
        this.phoneInput.addEventListener(  'change', () => this.validatePhone());
        this.messageInput.addEventListener('change', () => this.validateMessage());

        this.isListenersSet = true;
    }
}