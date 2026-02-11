import numpy as np
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D  # noqa: F401

# Function and gradient
def f(x, y):
    return x**2 + y**2

def grad_f(x, y):
    return np.array([2*x, 2*y])

# Point and direction
x0, y0 = 1.0, 0.5
z0 = f(x0, y0)

u = np.array([1, 2])
u = u / np.linalg.norm(u)

grad = grad_f(x0, y0)
Duf = grad @ u

# Grid
x = np.linspace(-2, 2, 100)
y = np.linspace(-2, 2, 100)
X, Y = np.meshgrid(x, y)
Z = f(X, Y)

# --- Figure ---
fig = plt.figure(figsize=(6, 5))
ax = fig.add_subplot(projection="3d")

# Surface
ax.plot_surface(X, Y, Z, cmap="viridis", alpha=0.75)

# Point on surface
ax.scatter(x0, y0, z0, color="black", s=40)

# Gradient vector (lifted to 3D)
ax.quiver(
    x0, y0, z0,
    grad[0], grad[1], np.linalg.norm(grad)**2,
    color="red",
    length=0.2,
    normalize=True,
    label=r"$\nabla f$"
)

# Directional derivative vector (tangent)
ax.quiver(
    x0, y0, z0,
    u[0], u[1], Duf,
    color="blue",
    length=0.4,
    normalize=True,
    label=r"$D_{\mathbf u} f$"
)

ax.set_xlabel(r"$x$")
ax.set_ylabel(r"$y$")
ax.set_zlabel(r"$z$")
ax.set_title("Directional derivative on the surface")

ax.view_init(elev=10, azim=45)

# --- Export ---
fig.tight_layout()
fig.savefig("test2.svg", bbox_inches="tight")
plt.close(fig)
