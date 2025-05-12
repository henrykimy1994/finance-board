/**
 * FinTrack - Personal Finance Management
 * Main Application JavaScript
 */

// Use IIFE for encapsulation and to avoid global scope pollution
(function() {
    'use strict';
    
    // App namespace
    const FinTrack = {};
    
    // Configuration
    FinTrack.config = {
        apiEndpoint: 'https://api.fintrack.example.com/v1',
        dateFormat: 'MMM DD, YYYY',
        currency: 'USD',
        defaultView: 'dashboard'
    };
    
    // DOM elements
    FinTrack.elements = {
        sections: document.querySelectorAll('.section'),
        navLinks: document.querySelectorAll('.nav-link'),
        addTransactionBtn: document.querySelector('#addTransactionBtn'),
        saveTransactionBtn: document.querySelector('#saveTransaction'),
        transactionForm: document.querySelector('#transactionForm')
    };
    
    // Current user data (would be loaded from backend/localStorage in a real app)
    FinTrack.userData = {
        userId: 'usr_12345',
        accounts: [
            { id: 'acc_1', name: 'Checking Account', balance: 3250.75, type: 'checking' },
            { id: 'acc_2', name: 'Savings Account', balance: 12680.50, type: 'savings' },
            { id: 'acc_3', name: 'Credit Card', balance: -1540.30, type: 'credit' }
        ],
        categories: [
            { id: 'cat_1', name: 'Groceries', icon: 'fa-shopping-basket', color: 'var(--groceries-color)', type: 'expense' },
            { id: 'cat_2', name: 'Dining', icon: 'fa-utensils', color: 'var(--dining-color)', type: 'expense' },
            { id: 'cat_3', name: 'Transportation', icon: 'fa-car', color: 'var(--transportation-color)', type: 'expense' },
            { id: 'cat_4', name: 'Utilities', icon: 'fa-bolt', color: 'var(--utilities-color)', type: 'expense' },
            { id: 'cat_5', name: 'Entertainment', icon: 'fa-film', color: 'var(--entertainment-color)', type: 'expense' },
            { id: 'cat_6', name: 'Shopping', icon: 'fa-shopping-bag', color: 'var(--shopping-color)', type: 'expense' },
            { id: 'cat_7', name: 'Housing', icon: 'fa-home', color: 'var(--housing-color)', type: 'expense' },
            { id: 'cat_8', name: 'Salary', icon: 'fa-briefcase', color: 'var(--income-color)', type: 'income' },
            { id: 'cat_9', name: 'Transfer', icon: 'fa-exchange-alt', color: 'var(--transfer-color)', type: 'transfer' }
        ],
        goals: [
            { id: 'goal_1', name: 'Vacation Fund', icon: 'fa-plane', target: 5000, current: 3250, dueDate: '2025-12-31' },
            { id: 'goal_2', name: 'New Car', icon: 'fa-car', target: 20000, current: 8000, dueDate: '2026-06-30' },
            { id: 'goal_3', name: 'Home Down Payment', icon: 'fa-home', target: 50000, current: 10000, dueDate: '2027-01-31' }
        ],
        budgets: [
            { id: 'budget_1', category: 'cat_1', amount: 500, spent: 450, period: 'monthly' },
            { id: 'budget_2', category: 'cat_2', amount: 300, spent: 320, period: 'monthly' },
            { id: 'budget_3', category: 'cat_3', amount: 300, spent: 290, period: 'monthly' },
            { id: 'budget_4', category: 'cat_5', amount: 200, spent: 180, period: 'monthly' },
            { id: 'budget_5', category: 'cat_6', amount: 400, spent: 240, period: 'monthly' }
        ]
    };
    
    // Initialize the application
    FinTrack.init = function() {
        this.setupEventListeners();
        this.handleNavigation();
        this.initBootstrapComponents();
        
        // Initialize dashboard (either here or through navigation)
        // Any other initializations...
        
        console.log('FinTrack application initialized');
    };
    
    // Set up event listeners
    FinTrack.setupEventListeners = function() {
        // Navigation links
        this.elements.navLinks.forEach(link => {
            link.addEventListener('click', this.handleNavigation.bind(this));
        });
        
        // Navigation through other links (e.g., "View All" buttons)
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            if (!link.classList.contains('nav-link') && !link.classList.contains('dropdown-item')) {
                link.addEventListener('click', this.handleLinkNavigation.bind(this));
            }
        });
        
        // Add transaction button
        if (this.elements.addTransactionBtn) {
            this.elements.addTransactionBtn.addEventListener('click', this.openAddTransactionModal.bind(this));
        }
        
        // Save transaction button
        if (this.elements.saveTransactionBtn) {
            this.elements.saveTransactionBtn.addEventListener('click', this.saveTransaction.bind(this));
        }
        
        // Window resize event (for responsive adjustments if needed)
        window.addEventListener('resize', this.handleResize.bind(this));
        
        // Handle hash change (browser back/forward buttons)
        window.addEventListener('hashchange', this.handleHashChange.bind(this));
    };
    
    // Handle navigation
    FinTrack.handleNavigation = function(event) {
        if (event) {
            event.preventDefault();
            
            // If clicked on dropdown toggle, don't navigate
            if (event.currentTarget.getAttribute('data-bs-toggle') === 'dropdown') {
                return;
            }
        }
        
        // Get the target section from the URL hash or default to dashboard
        const targetId = window.location.hash || `#${this.config.defaultView}`;
        const targetSection = document.querySelector(targetId);
        
        // If target section exists, show it and hide others
        if (targetSection) {
            // Hide all sections
            this.elements.sections.forEach(section => {
                section.classList.remove('active');
            });
            
            // Show target section
            targetSection.classList.add('active');
            
            // Update active navigation link
            this.elements.navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === targetId) {
                    link.classList.add('active');
                }
            });
            
            // Perform any section-specific initializations
            this.initSectionContent(targetId.substring(1));
        }
    };
    
    // Handle navigation from non-nav links (e.g., "View All" buttons)
    FinTrack.handleLinkNavigation = function(event) {
        const targetId = event.currentTarget.getAttribute('href');
        
        // Only prevent default if it's an internal link
        if (targetId.startsWith('#')) {
            event.preventDefault();
            window.location.hash = targetId;
            this.handleNavigation();
        }
    };
    
    // Handle hash change (browser back/forward buttons)
    FinTrack.handleHashChange = function() {
        this.handleNavigation();
    };
    
    // Initialize content for specific sections
    FinTrack.initSectionContent = function(sectionId) {
        switch(sectionId) {
            case 'dashboard':
                // Dashboard already initialized by charts.js
                break;
            case 'transactions':
                // Transactions already initialized by transactions.js
                break;
            case 'budget':
                console.log('Budget section initialized');
                // Initialize budget section content
                break;
            case 'goals':
                console.log('Goals section initialized');
                // Initialize goals section content
                break;
            case 'reports':
                console.log('Reports section initialized');
                // Initialize reports section content
                break;
            default:
                break;
        }
    };
    
    // Initialize Bootstrap components
    FinTrack.initBootstrapComponents = function() {
        // Initialize tooltips
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
        
        // Initialize popovers
        const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
        popoverTriggerList.map(function (popoverTriggerEl) {
            return new bootstrap.Popover(popoverTriggerEl);
        });
        
        // Add transaction modal
        this.transactionModal = new bootstrap.Modal(document.getElementById('addTransactionModal'));
    };
    
    // Open add transaction modal
    FinTrack.openAddTransactionModal = function() {
        // Reset form if needed
        if (this.elements.transactionForm) {
            this.elements.transactionForm.reset();
        }
        
        // Set default date to today
        const dateInput = document.getElementById('transactionDate');
        if (dateInput) {
            const today = new Date();
            const formattedDate = today.toISOString().split('T')[0]; // YYYY-MM-DD format
            dateInput.value = formattedDate;
        }
        
        // Show the modal
        this.transactionModal.show();
    };
    
    // Save transaction (would connect to API in a real app)
    FinTrack.saveTransaction = function() {
        // Get form data
        const form = this.elements.transactionForm;
        if (!form) return;
        
        // Check form validity
        if (!form.checkValidity()) {
            // Trigger browser's built-in validation UI
            form.reportValidity();
            return;
        }
        
        // Get form values
        const transactionData = {
            date: document.getElementById('transactionDate').value,
            description: document.getElementById('transactionDescription').value,
            amount: parseFloat(document.getElementById('transactionAmount').value),
            type: document.getElementById('transactionType').value,
            category: document.getElementById('transactionCategory').value,
            account: document.getElementById('transactionAccount').value,
            notes: document.getElementById('transactionNotes').value
        };
        
        // In a real app, you would send this data to your API
        console.log('Saving transaction:', transactionData);
        
        // For demo purposes, pretend to save and update UI
        this.addTransactionToUI(transactionData);
        
        // Close the modal
        this.transactionModal.hide();
        
        // Show success message
        this.showNotification('Transaction added successfully', 'success');
    };
    
    // Add a new transaction to the UI (for demo)
    FinTrack.addTransactionToUI = function(transaction) {
        // Find the transaction list element
        const transactionList = document.querySelector('.transaction-list');
        if (!transactionList) return;
        
        // Create icon based on category (simplified version)
        let iconClass = 'fa-receipt';
        if (transaction.type === 'income') {
            iconClass = 'fa-briefcase';
        } else if (transaction.category === 'groceries') {
            iconClass = 'fa-shopping-basket';
        } else if (transaction.category === 'dining') {
            iconClass = 'fa-utensils';
        } else if (transaction.category === 'entertainment') {
            iconClass = 'fa-film';
        }
        
        // Format date for display
        const dateObj = new Date(transaction.date);
        const formattedDate = dateObj.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        });
        
        // Create new transaction item
        const transactionItem = document.createElement('div');
        transactionItem.className = 'list-group-item transaction-item';
        transactionItem.innerHTML = `
            <div class="transaction-icon ${transaction.category}">
                <i class="fas ${iconClass}"></i>
            </div>
            <div class="transaction-details">
                <h6>${transaction.description}</h6>
                <p class="transaction-date">${formattedDate}</p>
            </div>
            <div class="transaction-amount ${transaction.type}">
                ${transaction.type === 'expense' ? '-' : '+'}$${transaction.amount.toFixed(2)}
            </div>
        `;
        
        // Add the new transaction at the top of the list
        transactionList.prepend(transactionItem);
    };
    
    // Show notification
    FinTrack.showNotification = function(message, type = 'info') {
        // Check if the notification container exists, create if not
        let notificationContainer = document.querySelector('.notification-container');
        if (!notificationContainer) {
            notificationContainer = document.createElement('div');
            notificationContainer.className = 'notification-container';
            document.body.appendChild(notificationContainer);
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type} animate-slideUp`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Add to container
        notificationContainer.appendChild(notification);
        
        // Add close functionality
        notification.querySelector('.notification-close').addEventListener('click', function() {
            notification.classList.add('notification-hiding');
            setTimeout(() => {
                notification.remove();
            }, 300);
        });
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            notification.classList.add('notification-hiding');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
    };
    
    // Get icon for notification type
    FinTrack.getNotificationIcon = function(type) {
        switch(type) {
            case 'success':
                return 'fa-check-circle';
            case 'warning':
                return 'fa-exclamation-triangle';
            case 'error':
                return 'fa-times-circle';
            case 'info':
            default:
                return 'fa-info-circle';
        }
    };
    
    // Handle window resize events
    FinTrack.handleResize = function() {
        // Add any responsive adjustments here
        // For example, collapse the navbar on smaller screens
    };
    
    // Utility function to format currency
    FinTrack.formatCurrency = function(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: this.config.currency
        }).format(amount);
    };
    
    // Utility function to format date
    FinTrack.formatDate = function(date) {
        const dateObj = new Date(date);
        return dateObj.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };
    
    // Initialize the app when DOM is fully loaded
    document.addEventListener('DOMContentLoaded', function() {
        FinTrack.init();
    });
    
    // Export to window for debugging (would be removed in production)
    window.FinTrack = FinTrack;
    
})();