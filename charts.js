/**
 * FinTrack - Personal Finance Management
 * Charts and Data Visualization Module
 */

(function() {
    'use strict';
    
    // Initialize the Charts module within the FinTrack namespace
    if (window.FinTrack === undefined) {
        console.error('FinTrack core module not found. Make sure to load app.js before charts.js.');
        return;
    }
    
    // Charts module
    FinTrack.Charts = {};
    
    // Chart instances
    FinTrack.Charts.instances = {};
    
    // Chart color settings
    FinTrack.Charts.colors = {
        income: 'rgba(76, 175, 80, 0.8)',
        incomeLight: 'rgba(76, 175, 80, 0.2)',
        expenses: 'rgba(244, 67, 54, 0.8)',
        expensesLight: 'rgba(244, 67, 54, 0.2)',
        savings: 'rgba(58, 123, 213, 0.8)',
        savingsLight: 'rgba(58, 123, 213, 0.2)',
        categoryColors: [
            'rgba(255, 99, 132, 0.8)',
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 206, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(153, 102, 255, 0.8)',
            'rgba(255, 159, 64, 0.8)',
            'rgba(199, 199, 199, 0.8)',
            'rgba(83, 102, 255, 0.8)',
            'rgba(40, 159, 64, 0.8)',
            'rgba(210, 199, 199, 0.8)'
        ]
    };
    
    // Sample data (to be replaced with real API data)
    FinTrack.Charts.sampleData = {
        // Monthly data for the last 6 months
        monthlyData: [
            { month: 'Dec', income: 4890, expenses: 3200, savings: 1690 },
            { month: 'Jan', income: 4950, expenses: 3300, savings: 1650 },
            { month: 'Feb', income: 5100, expenses: 3150, savings: 1950 },
            { month: 'Mar', income: 5050, expenses: 3250, savings: 1800 },
            { month: 'Apr', income: 4980, expenses: 3350, savings: 1630 },
            { month: 'May', income: 5240, expenses: 3180, savings: 2060 }
        ],
        
        // Expense breakdown for the current month
        expenseBreakdown: [
            { category: 'Housing', amount: 1200 },
            { category: 'Groceries', amount: 450 },
            { category: 'Dining', amount: 320 },
            { category: 'Transportation', amount: 290 },
            { category: 'Utilities', amount: 230 },
            { category: 'Entertainment', amount: 180 },
            { category: 'Shopping', amount: 240 },
            { category: 'Others', amount: 270 }
        ]
    };
    
    // Initialize all charts
    FinTrack.Charts.init = function() {
        this.initMonthlyOverviewChart();
        this.initExpenseBreakdownChart();
        this.setupChartEventListeners();
    };
    
    // Initialize Monthly Overview Chart
    FinTrack.Charts.initMonthlyOverviewChart = function() {
        const ctx = document.getElementById('monthlyOverviewChart');
        if (!ctx) return;
        
        // Extract data
        const labels = this.sampleData.monthlyData.map(d => d.month);
        const incomeData = this.sampleData.monthlyData.map(d => d.income);
        const expenseData = this.sampleData.monthlyData.map(d => d.expenses);
        const savingsData = this.sampleData.monthlyData.map(d => d.savings);
        
        // Create chart
        this.instances.monthlyOverview = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Income',
                        data: incomeData,
                        backgroundColor: this.colors.income,
                        borderColor: this.colors.income,
                        borderWidth: 1
                    },
                    {
                        label: 'Expenses',
                        data: expenseData,
                        backgroundColor: this.colors.expenses,
                        borderColor: this.colors.expenses,
                        borderWidth: 1
                    },
                    {
                        label: 'Savings',
                        data: savingsData,
                        backgroundColor: this.colors.savings,
                        borderColor: this.colors.savings,
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            boxWidth: 12,
                            padding: 15
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += new Intl.NumberFormat('en-US', {
                                        style: 'currency',
                                        currency: 'USD'
                                    }).format(context.parsed.y);
                                }
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    };
    
    // Initialize Expense Breakdown Chart (Doughnut)
    FinTrack.Charts.initExpenseBreakdownChart = function() {
        const ctx = document.getElementById('expenseBreakdownChart');
        if (!ctx) return;
        
        // Extract data
        const labels = this.sampleData.expenseBreakdown.map(d => d.category);
        const data = this.sampleData.expenseBreakdown.map(d => d.amount);
        
        // Create chart
        this.instances.expenseBreakdown = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: this.colors.categoryColors,
                    borderWidth: 1,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '65%',
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            boxWidth: 12,
                            padding: 15
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.raw;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = Math.round((value / total) * 100);
                                
                                return `${label}: ${new Intl.NumberFormat('en-US', {
                                    style: 'currency',
                                    currency: 'USD'
                                }).format(value)} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    };
    
    // Set up event listeners for chart filters and controls
    FinTrack.Charts.setupChartEventListeners = function() {
        // Monthly overview chart period selector
        const chartPeriodSelect = document.getElementById('chart-period');
        if (chartPeriodSelect) {
            chartPeriodSelect.addEventListener('change', this.updateMonthlyOverviewChart.bind(this));
        }
        
        // Expense breakdown period selector
        const expensePeriodSelect = document.getElementById('expense-period');
        if (expensePeriodSelect) {
            expensePeriodSelect.addEventListener('change', this.updateExpenseBreakdownChart.bind(this));
        }
    };
    
    // Update Monthly Overview Chart based on selected period
    FinTrack.Charts.updateMonthlyOverviewChart = function(event) {
        const period = event.target.value;
        console.log('Updating monthly overview chart for period:', period);
        
        // In a real app, you would fetch new data from your API based on the period
        // For demo purposes, we'll just simulate different periods
        
        let updatedData;
        switch(period) {
            case '3m':
                updatedData = this.sampleData.monthlyData.slice(-3);
                break;
            case '1y':
                // Sample data for a full year (simulated)
                updatedData = [
                    { month: 'Jun', income: 4820, expenses: 3150, savings: 1670 },
                    { month: 'Jul', income: 4880, expenses: 3220, savings: 1660 },
                    { month: 'Aug', income: 4850, expenses: 3200, savings: 1650 },
                    { month: 'Sep', income: 4890, expenses: 3250, savings: 1640 },
                    { month: 'Oct', income: 4900, expenses: 3280, savings: 1620 },
                    { month: 'Nov', income: 4870, expenses: 3240, savings: 1630 },
                    { month: 'Dec', income: 4890, expenses: 3200, savings: 1690 },
                    { month: 'Jan', income: 4950, expenses: 3300, savings: 1650 },
                    { month: 'Feb', income: 5100, expenses: 3150, savings: 1950 },
                    { month: 'Mar', income: 5050, expenses: 3250, savings: 1800 },
                    { month: 'Apr', income: 4980, expenses: 3350, savings: 1630 },
                    { month: 'May', income: 5240, expenses: 3180, savings: 2060 }
                ];
                break;
            case '6m':
            default:
                updatedData = this.sampleData.monthlyData;
                break;
        }
        
        // Update chart data
        const chart = this.instances.monthlyOverview;
        if (chart) {
            chart.data.labels = updatedData.map(d => d.month);
            chart.data.datasets[0].data = updatedData.map(d => d.income);
            chart.data.datasets[1].data = updatedData.map(d => d.expenses);
            chart.data.datasets[2].data = updatedData.map(d => d.savings);
            chart.update();
        }
    };
    
    // Update Expense Breakdown Chart based on selected period
    FinTrack.Charts.updateExpenseBreakdownChart = function(event) {
        const period = event.target.value;
        console.log('Updating expense breakdown chart for period:', period);
        
        // In a real app, you would fetch new data from your API based on the period
        // For demo purposes, we'll just simulate different periods
        
        let updatedData;
        switch(period) {
            case 'previous':
                // Sample data for previous month (simulated)
                updatedData = [
                    { category: 'Housing', amount: 1200 },
                    { category: 'Groceries', amount: 420 },
                    { category: 'Dining', amount: 350 },
                    { category: 'Transportation', amount: 280 },
                    { category: 'Utilities', amount: 210 },
                    { category: 'Entertainment', amount: 190 },
                    { category: 'Shopping', amount: 220 },
                    { category: 'Others', amount: 250 }
                ];
                break;
            case 'current':
            default:
                updatedData = this.sampleData.expenseBreakdown;
                break;
        }
        
        // Update chart data
        const chart = this.instances.expenseBreakdown;
        if (chart) {
            chart.data.labels = updatedData.map(d => d.category);
            chart.data.datasets[0].data = updatedData.map(d => d.amount);
            chart.update();
        }
    };
    
    // Load initial charts when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        // Initialize charts module if FinTrack is ready
        if (window.FinTrack) {
            FinTrack.Charts.init();
        } else {
            // If FinTrack is not ready yet, wait a bit and try again
            setTimeout(function() {
                if (window.FinTrack) {
                    FinTrack.Charts.init();
                }
            }, 100);
        }
    });
    
})();