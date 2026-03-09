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
u = np.array([1, 2])
u = u / np.linalg.norm(u)  # unit direction

grad = grad_f(x0, y0)

# Grid for surface
x = np.linspace(-2, 2, 100)
y = np.linspace(-2, 2, 100)
X, Y = np.meshgrid(x, y)
Z = f(X, Y)

# --- Figure ---
fig = plt.figure(figsize=(8, 4))

# =========================
# 3D surface plot
# =========================
ax3d = fig.add_subplot(1, 2, 1, projection="3d")
ax3d.plot_surface(X, Y, Z, cmap="viridis", alpha=0.8)

# Point on surface
ax3d.scatter(x0, y0, f(x0, y0), color="red", s=40)

ax3d.set_xlabel(r"$x$")
ax3d.set_ylabel(r"$y$")
ax3d.set_zlabel(r"$z$")
ax3d.set_title(r"$z = f(x,y)$")

# =========================
# 2D contour + vectors
# =========================
ax = fig.add_subplot(1, 2, 2)
ax.contour(X, Y, Z, levels=15, cmap="viridis")

# Gradient vector
ax.quiver(
    x0, y0,
    grad[0], grad[1],
    color="red",
    angles="xy",
    scale_units="xy",
    scale=1,
    label=r"$\nabla f$"
)

# Direction vector
ax.quiver(
    x0, y0,
    u[0], u[1],
    color="blue",
    angles="xy",
    scale_units="xy",
    scale=1,
    label=r"$\mathbf{u}$"
)

ax.scatter(x0, y0, color="black")
ax.set_aspect("equal")
ax.set_xlabel(r"$x$")
ax.set_ylabel(r"$y$")
ax.set_title("Directional derivative")
ax.legend()
ax.grid(True, alpha=0.3)

# --- Export ---
fig.tight_layout()
fig.savefig("test.svg", bbox_inches="tight")
plt.close(fig)
