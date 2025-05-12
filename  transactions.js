/**
 * FinTrack - Personal Finance Management
 * Transactions Management Module
 */

(function() {
    'use strict';
    
    // Initialize the Transactions module within the FinTrack namespace
    if (window.FinTrack === undefined) {
        console.error('FinTrack core module not found. Make sure to load app.js before transactions.js.');
        return;
    }
    
    // Transactions module
    FinTrack.Transactions = {};
    
    // DOM elements
    FinTrack.Transactions.elements = {
        transactionTable: document.querySelector('.transaction-table'),
        transactionList: document.querySelector('.transaction-list'),
        searchInput: document.querySelector('#transactions input[type="text"]'),
        categoryFilter: document.querySelector('#transactions select:nth-of-type(1)'),
        accountFilter: document.querySelector('#transactions select:nth-of-type(2)'),
        periodFilter: document.querySelector('#transactions select:nth-of-type(3)'),
        addTransactionBtn: document.querySelector('.card-header button'),
        pagination: document.querySelector('.pagination')
    };
    
    // Sample transactions data (would be loaded from API in a real app)
    FinTrack.Transactions.data = {
        transactions: [
            {
                id: 'tx_001',
                date: '2025-05-12',
                description: 'Grocery Store',
                category: 'groceries',
                categoryDisplay: 'Groceries',
                account: 'checking',
                accountDisplay: 'Checking',
                amount: 125.30,
                type: 'expense'
            },
            {
                id: 'tx_002',
                date: '2025-05-11',
                description: 'Salary Deposit',
                category: 'salary',
                categoryDisplay: 'Income',
                account: 'checking',
                accountDisplay: 'Checking',
                amount: 2450.00,
                type: 'income'
            },
            {
                id: 'tx_003',
                date: '2025-05-11',
                description: 'Movie Tickets',
                category: 'entertainment',
                categoryDisplay: 'Entertainment',
                account: 'credit',
                accountDisplay: 'Credit Card',
                amount: 42.50,
                type: 'expense'
            },
            {
                id: 'tx_004',
                date: '2025-05-10',
                description: 'Restaurant',
                category: 'dining',
                categoryDisplay: 'Dining',
                account: 'credit',
                accountDisplay: 'Credit Card',
                amount: 78.65,
                type: 'expense'
            },
            {
                id: 'tx_005',
                date: '2025-05-09',
                description: 'Electric Bill',
                category: 'utilities',
                categoryDisplay: 'Utilities',
                account: 'checking',
                accountDisplay: 'Checking',
                amount: 94.20,
                type: 'expense'
            },
            {
                id: 'tx_006',
                date: '2025-05-08',
                description: 'Gas Station',
                category: 'transportation',
                categoryDisplay: 'Transportation',
                account: 'credit',
                accountDisplay: 'Credit Card',
                amount: 45.70,
                type: 'expense'
            },
            {
                id: 'tx_007',
                date: '2025-05-07',
                description: 'Online Shopping',
                category: 'shopping',
                categoryDisplay: 'Shopping',
                account: 'credit',
                accountDisplay: 'Credit Card',
                amount: 120.85,
                type: 'expense'
            },
            {
                id: 'tx_008',
                date: '2025-05-05',
                description: 'Savings Transfer',
                category: 'transfer',
                categoryDisplay: 'Transfer',
                account: 'savings',
                accountDisplay: 'Savings',
                amount: 500.00,
                type: 'transfer'
            },
            {
                id: 'tx_009',
                date: '2025-05-03',
                description: 'Coffee Shop',
                category: 'dining',
                categoryDisplay: 'Dining',
                account: 'credit',
                accountDisplay: 'Credit Card',
                amount: 8.50,
                type: 'expense'
            },
            {
                id: 'tx_010',
                date: '2025-05-01',
                description: 'Rent Payment',
                category: 'housing',
                categoryDisplay: 'Housing',
                account: 'checking',
                accountDisplay: 'Checking',
                amount: 1200.00,
                type: 'expense'
            }
        ],
        
        // Pagination state
        pagination: {
            currentPage: 1,
            itemsPerPage: 10,
            totalItems: 10
        },
        
        // Filter state
        filters: {
            search: '',
            category: 'all',
            account: 'all',
            period: '30days'
        }
    };
    
    // Initialize transactions module
    FinTrack.Transactions.init = function() {
        this.setupEventListeners();
        this.renderTransactions();
        console.log('Transactions module initialized');
    };
    
    // Set up event listeners
    FinTrack.Transactions.setupEventListeners = function() {
        const elements = this.elements;
        
        // Search input
        if (elements.searchInput) {
            elements.searchInput.addEventListener('input', this.handleSearchInput.bind(this));
        }
        
        // Category filter
        if (elements.categoryFilter) {
            elements.categoryFilter.addEventListener('change', this.handleFilterChange.bind(this));
        }
        
        // Account filter
        if (elements.accountFilter) {
            elements.accountFilter.addEventListener('change', this.handleFilterChange.bind(this));
        }
        
        // Period filter
        if (elements.periodFilter) {
            elements.periodFilter.addEventListener('change', this.handleFilterChange.bind(this));
        }
        
        // Add transaction button
        if (elements.addTransactionBtn) {
            elements.addTransactionBtn.addEventListener('click', function() {
                if (window.FinTrack && window.FinTrack.openAddTransactionModal) {
                    window.FinTrack.openAddTransactionModal();
                }
            });
        }
        
        // Edit and delete buttons
        if (elements.transactionTable) {
            elements.transactionTable.addEventListener('click', this.handleTableActions.bind(this));
        }
        
        // Pagination links
        if (elements.pagination) {
            elements.pagination.addEventListener('click', this.handlePagination.bind(this));
        }
    };
    
    // Handle search input
    FinTrack.Transactions.handleSearchInput = function(event) {
        const searchText = event.target.value.trim().toLowerCase();
        this.data.filters.search = searchText;
        this.data.pagination.currentPage = 1; // Reset to first page on search
        this.renderTransactions();
    };
    
    // Handle filter change
    FinTrack.Transactions.handleFilterChange = function(event) {
        const filterName = event.target.id || event.target.name;
        const filterValue = event.target.value;
        
        // Determine which filter changed based on the select's position
        if (event.target === this.elements.categoryFilter) {
            this.data.filters.category = filterValue;
        } else if (event.target === this.elements.accountFilter) {
            this.data.filters.account = filterValue;
        } else if (event.target === this.elements.periodFilter) {
            this.data.filters.period = filterValue;
        }
        
        this.data.pagination.currentPage = 1; // Reset to first page on filter change
        this.renderTransactions();
    };
    
    // Handle table action buttons (edit, delete)
    FinTrack.Transactions.handleTableActions = function(event) {
        const target = event.target.closest('button');
        if (!target) return;
        
        const row = target.closest('tr');
        if (!row) return;
        
        const transactionId = row.dataset.id;
        if (!transactionId) return;
        
        // Check which button was clicked by its icon
        if (target.querySelector('.fa-edit')) {
            this.editTransaction(transactionId);
        } else if (target.querySelector('.fa-trash-alt')) {
            this.deleteTransaction(transactionId);
        }
    };
    
    // Handle pagination clicks
    FinTrack.Transactions.handlePagination = function(event) {
        const target = event.target.closest('a');
        if (!target) return;
        
        event.preventDefault();
        
        const page = target.textContent.trim();
        const currentPage = this.data.pagination.currentPage;
        const totalPages = Math.ceil(this.data.pagination.totalItems / this.data.pagination.itemsPerPage);
        
        if (page === 'Previous') {
            if (currentPage > 1) {
                this.data.pagination.currentPage = currentPage - 1;
            }
        } else if (page === 'Next') {
            if (currentPage < totalPages) {
                this.data.pagination.currentPage = currentPage + 1;
            }
        } else {
            this.data.pagination.currentPage = parseInt(page, 10);
        }
        
        this.renderTransactions();
    };
    
    // Filter transactions based on current filters
    FinTrack.Transactions.filterTransactions = function() {
        let filtered = [...this.data.transactions];
        const filters = this.data.filters;
        
        // Apply search filter
        if (filters.search) {
            filtered = filtered.filter(tx => 
                tx.description.toLowerCase().includes(filters.search) ||
                tx.category.toLowerCase().includes(filters.search) ||
                tx.account.toLowerCase().includes(filters.search)
            );
        }
        
        // Apply category filter
        if (filters.category && filters.category !== 'all') {
            filtered = filtered.filter(tx => tx.category === filters.category);
        }
        
        // Apply account filter
        if (filters.account && filters.account !== 'all') {
            filtered = filtered.filter(tx => tx.account === filters.account);
        }
        
        // Apply date period filter
        if (filters.period) {
            const today = new Date();
            let startDate;
            
            switch(filters.period) {
                case '30days':
                    startDate = new Date(today);
                    startDate.setDate(today.getDate() - 30);
                    break;
                case '90days':
                    startDate = new Date(today);
                    startDate.setDate(today.getDate() - 90);
                    break;
                case '6months':
                    startDate = new Date(today);
                    startDate.setMonth(today.getMonth() - 6);
                    break;
                case '1year':
                    startDate = new Date(today);
                    startDate.setFullYear(today.getFullYear() - 1);
                    break;
                default:
                    startDate = new Date(0); // Beginning of time
            }
            
            filtered = filtered.filter(tx => {
                const txDate = new Date(tx.date);
                return txDate >= startDate && txDate <= today;
            });
        }
        
        // Update total count for pagination
        this.data.pagination.totalItems = filtered.length;
        
        return filtered;
    };
    
    // Render transactions to the table
    FinTrack.Transactions.renderTransactions = function() {
        const tableBody = this.elements.transactionTable?.querySelector('tbody');
        if (!tableBody) return;
        
        // Get filtered transactions
        const filtered = this.filterTransactions();
        
        // Apply pagination
        const { currentPage, itemsPerPage } = this.data.pagination;
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedTransactions = filtered.slice(startIndex, endIndex);
        
        // Clear existing rows
        tableBody.innerHTML = '';
        
        // Add new rows
        if (paginatedTransactions.length === 0) {
            // No results
            const emptyRow = document.createElement('tr');
            emptyRow.innerHTML = `
                <td colspan="6" class="text-center py-4">
                    <p class="text-muted mb-0">No transactions found matching your criteria.</p>
                </td>
            `;
            tableBody.appendChild(emptyRow);
        } else {
            // Render transactions
            paginatedTransactions.forEach(tx => {
                const row = document.createElement('tr');
                row.dataset.id = tx.id;
                
                // Format date for display
                const txDate = new Date(tx.date);
                const formattedDate = txDate.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                });
                
                // Format amount and set appropriate CSS class
                const amountClass = tx.type === 'income' ? 'income' : (tx.type === 'expense' ? 'expense' : 'transfer');
                const amountSign = tx.type === 'expense' ? '-' : (tx.type === 'income' ? '+' : '');
                const formattedAmount = `${amountSign}$${tx.amount.toFixed(2)}`;
                
                // Create row HTML
                row.innerHTML = `
                    <td>${formattedDate}</td>
                    <td>${tx.description}</td>
                    <td><span class="badge bg-soft-${this.getCategoryBadgeClass(tx.category)}">${tx.categoryDisplay}</span></td>
                    <td>${tx.accountDisplay}</td>
                    <td class="${amountClass}">${formattedAmount}</td>
                    <td>
                        <button class="btn btn-sm btn-icon edit-btn"><i class="fas fa-edit"></i></button>
                        <button class="btn btn-sm btn-icon delete-btn"><i class="fas fa-trash-alt"></i></button>
                    </td>
                `;
                
                tableBody.appendChild(row);
            });
        }
        
        // Update pagination
        this.updatePagination();
    };
    
    // Update pagination controls
    FinTrack.Transactions.updatePagination = function() {
        const paginationElement = this.elements.pagination;
        if (!paginationElement) return;
        
        const { currentPage, itemsPerPage, totalItems } = this.data.pagination;
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        
        // Clear existing pagination
        paginationElement.innerHTML = '';
        
        // No need for pagination if only one page
        if (totalPages <= 1) return;
        
        // Previous button
        const prevLi = document.createElement('li');
        prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
        prevLi.innerHTML = `<a class="page-link" href="#" tabindex="-1">Previous</a>`;
        paginationElement.appendChild(prevLi);
        
        // Page numbers
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, startPage + 4);
        
        // Adjust start if end is too close to total
        if (endPage - startPage < 4) {
            startPage = Math.max(1, endPage - 4);
        }
        
        for (let i = startPage; i <= endPage; i++) {
            const pageLi = document.createElement('li');
            pageLi.className = `page-item ${i === currentPage ? 'active' : ''}`;
            pageLi.innerHTML = `<a class="page-link" href="#">${i}</a>`;
            paginationElement.appendChild(pageLi);
        }
        
        // Next button
        const nextLi = document.createElement('li');
        nextLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
        nextLi.innerHTML = `<a class="page-link" href="#">Next</a>`;
        paginationElement.appendChild(nextLi);
    };
    
    // Get appropriate badge class based on category
    FinTrack.Transactions.getCategoryBadgeClass = function(category) {
        switch(category) {
            case 'groceries':
                return 'primary';
            case 'dining':
                return 'warning';
            case 'entertainment':
                return 'info';
            case 'utilities':
                return 'danger';
            case 'transportation':
                return 'secondary';
            case 'shopping':
                return 'info';
            case 'housing':
                return 'danger';
            case 'salary':
            case 'income':
                return 'success';
            case 'transfer':
                return 'primary';
            default:
                return 'secondary';
        }
    };
    
    // Edit transaction (would connect to modal in a real app)
    FinTrack.Transactions.editTransaction = function(transactionId) {
        console.log('Editing transaction:', transactionId);
        
        // Find transaction by ID
        const transaction = this.data.transactions.find(tx => tx.id === transactionId);
        if (!transaction) return;
        
        // In a real app, you would populate the transaction form with this data
        // and open the modal for editing
        if (window.FinTrack && window.FinTrack.openAddTransactionModal) {
            // This is a simplified example - in a real app you would pass the transaction data
            window.FinTrack.openAddTransactionModal(transaction);
        }
        
        // For demo purposes, show a notification
        if (window.FinTrack && window.FinTrack.showNotification) {
            window.FinTrack.showNotification('Edit transaction feature will be available soon', 'info');
        }
    };
    
    // Delete transaction (would connect to API in a real app)
    FinTrack.Transactions.deleteTransaction = function(transactionId) {
        console.log('Deleting transaction:', transactionId);
        
        // For demo purposes, ask for confirmation
        const confirmed = confirm('Are you sure you want to delete this transaction?');
        if (!confirmed) return;
        
        // In a real app, you would send a delete request to your API
        // For demo purposes, we'll just remove it from our local data
        const index = this.data.transactions.findIndex(tx => tx.id === transactionId);
        if (index !== -1) {
            this.data.transactions.splice(index, 1);
            this.data.pagination.totalItems = this.data.transactions.length;
            
            // Re-render transactions
            this.renderTransactions();
            
            // Show success notification
            if (window.FinTrack && window.FinTrack.showNotification) {
                window.FinTrack.showNotification('Transaction deleted successfully', 'success');
            }
        }
    };
    
    // Add a new transaction (called from main app after modal save)
    FinTrack.Transactions.addTransaction = function(transaction) {
        // Generate a new ID (in a real app, this would come from the server)
        const newId = `tx_${(this.data.transactions.length + 1).toString().padStart(3, '0')}`;
        
        // Create the new transaction object
        const newTransaction = {
            id: newId,
            date: transaction.date,
            description: transaction.description,
            category: transaction.category,
            categoryDisplay: this.getCategoryDisplayName(transaction.category),
            account: transaction.account,
            accountDisplay: this.getAccountDisplayName(transaction.account),
            amount: parseFloat(transaction.amount),
            type: transaction.type
        };
        
        // Add to the beginning of the array (most recent first)
        this.data.transactions.unshift(newTransaction);
        this.data.pagination.totalItems = this.data.transactions.length;
        
        // Re-render transactions
        this.renderTransactions();
    };
    
    // Helper to get category display name
    FinTrack.Transactions.getCategoryDisplayName = function(categoryId) {
        // In a real app, you would look this up from your categories data
        const categoryMap = {
            'groceries': 'Groceries',
            'dining': 'Dining',
            'entertainment': 'Entertainment',
            'utilities': 'Utilities',
            'transportation': 'Transportation',
            'shopping': 'Shopping',
            'housing': 'Housing',
            'salary': 'Income',
            'transfer': 'Transfer'
        };
        
        return categoryMap[categoryId] || 'Other';
    };
    
    // Helper to get account display name
    FinTrack.Transactions.getAccountDisplayName = function(accountId) {
        // In a real app, you would look this up from your accounts data
        const accountMap = {
            'checking': 'Checking Account',
            'savings': 'Savings Account',
            'credit': 'Credit Card'
        };
        
        return accountMap[accountId] || 'Unknown Account';
    };
    
    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        // Initialize transactions module if FinTrack is ready
        if (window.FinTrack) {
            FinTrack.Transactions.init();
        } else {
            // If FinTrack is not ready yet, wait a bit and try again
            setTimeout(function() {
                if (window.FinTrack) {
                    FinTrack.Transactions.init();
                }
            }, 100);
        }
    });
    
})();