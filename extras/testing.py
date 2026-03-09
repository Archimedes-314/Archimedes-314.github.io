from sympy import symbols, Function, dsolve, Eq

x = symbols('x')
y = Function('y')(x)

ode = Eq(y.diff(x, 3) + y.diff(x, 2) - x, 0)

solution = dsolve(ode, y, ics={y.subs(x, 0): 1, y.diff(x).subs(x, 0): 1, y.diff(x, 2).subs(x, 3): -2})

expression = solution.rhs

print(f"The solution is: y(x) = {expression}")
