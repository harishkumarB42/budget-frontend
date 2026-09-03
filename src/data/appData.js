export const defaultBudgetData = {
budget: 50000,
income: 80000,
expenses: 25000,
};

export const revenueData = [
{ month: "Jan", revenue: 4000 },
{ month: "Feb", revenue: 5500 },
{ month: "Mar", revenue: 7000 },
{ month: "Apr", revenue: 6500 },
{ month: "May", revenue: 9000 },
{ month: "Jun", revenue: 11000 },
];

export const categoryData = [
{ name: "Food", value: 35 },
{ name: "Transport", value: 20 },
{ name: "Shopping", value: 25 },
{ name: "Bills", value: 20 },
];

export const COLORS = [
"#6366F1",
"#06B6D4",
"#10B981",
"#F59E0B",
];

export const defaultBudgetSummary = {
totalBudget: defaultBudgetData.budget,
spent: defaultBudgetData.expenses,
remaining:
defaultBudgetData.budget -
defaultBudgetData.expenses,

usage:
defaultBudgetData.budget > 0
? Math.round(
(defaultBudgetData.expenses /
defaultBudgetData.budget) *
100
)
: 0,
};
