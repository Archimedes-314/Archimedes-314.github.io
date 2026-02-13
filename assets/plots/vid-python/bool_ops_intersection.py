from manim import *

class BooleanOperationsIntersection(Scene):
    def construct(self):
        ellipse1 = Ellipse(
            width=5.0, height=5.0, fill_opacity=0.5, color=BLUE, stroke_width=10
        ).move_to(LEFT)
        ellipse2 = ellipse1.copy().set_color(color=RED).move_to(RIGHT)
        bool_ops_text = MarkupText("<u>Boolean Operation</u>").next_to(ellipse1, UP * 3)
        label_A = Text("A", font_size=36).move_to(ellipse1.get_center() + LEFT * 1.1)
        label_B = Text("B", font_size=36).move_to(ellipse2.get_center() + RIGHT * 1.1)
        ellipse_group = Group(bool_ops_text, ellipse1, ellipse2, label_A, label_B).move_to(LEFT * 3)
        self.play(FadeIn(ellipse_group))


        i = Intersection(ellipse1, ellipse2, color=GREEN, fill_opacity=0.5)
        self.play(i.animate.move_to(RIGHT * 4))
        intersection_text = MathTex(r"A \cap B", font_size=23).next_to(i, UP)
        self.play(FadeIn(intersection_text))