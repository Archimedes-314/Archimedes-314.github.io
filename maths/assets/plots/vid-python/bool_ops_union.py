from manim import *

class BooleanOperationsUnion(Scene):
    def construct(self):
        ellipse1 = Ellipse(
            width=5.0, height=5.0, fill_opacity=0.5, color=BLUE, stroke_width=10
        ).move_to(LEFT)
        ellipse2 = ellipse1.copy().set_color(color=RED).move_to(RIGHT)
        bool_ops_text = MarkupText("<u>Intersection</u>").next_to(ellipse1, UP * 3)
        label_A = Text("A", font_size=36).move_to(ellipse1.get_center() + LEFT * 1.1)
        label_B = Text("B", font_size=36).move_to(ellipse2.get_center() + RIGHT * 1.1)
        ellipse_group = Group(bool_ops_text, ellipse1, ellipse2, label_A, label_B).move_to(LEFT * 3)
        self.play(FadeIn(ellipse_group, run_time=1))

        self.wait(0.5)

        u = Union(ellipse1, ellipse2, color=ORANGE, fill_opacity=0.5)
        union_text = MathTex(r"A \cup B", font_size=36)
        self.play(u.animate)
        self.wait(0.1)
        self.play(u.animate.scale(0.8).move_to(RIGHT * 4))
        union_text.next_to(u, UP)
        self.play(FadeIn(union_text, run_time=0.5))

        self.wait(3)

# manim -pql --format gif --fps 30 bool_ops_union.py BooleanOperationsUnion