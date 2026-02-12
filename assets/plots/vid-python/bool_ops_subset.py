from manim import *

class BooleanOperationsSubset(Scene):
    def construct(self):
        ellipse1 = Ellipse(
            width=2.5, height=2.5, fill_opacity=0.5, color=BLUE, stroke_width=10
        ).move_to(LEFT)
        bool_ops_text = MarkupText("<u>Subset</u>").next_to(ellipse1, UP * 3)
        label_1 = Text("A", font_size=36).move_to(ellipse1)
        ellipse_group = VGroup(bool_ops_text, ellipse1, label_1).move_to(LEFT * 3)
        self.play(FadeIn(ellipse_group, run_time=1))

        self.wait(0.5)

        ellipse2 = ellipse1.copy().set_color(color=RED)

        self.play(FadeIn(ellipse2))
        self.wait(0.1)
        self.play(ellipse2.animate.move_to(RIGHT * 4 + UP * 1.5))
        ellipse2_text = Text("B").move_to(ellipse2)
        subset1_text = MathTex(r"B \subseteq A", font_size=36).next_to(ellipse2, UP)
        self.play(FadeIn(ellipse2_text), FadeIn(subset1_text))

        ellipse3 = Ellipse(
            width=1.5, height=1.5, fill_opacity=0.5, color=GREEN, stroke_width=10
        ).move_to(ellipse1.get_center())

        self.play(FadeIn(ellipse3))
        self.wait(0.1)
        self.play(ellipse3.animate.move_to(RIGHT * 4 + DOWN * 2))
        ellipse3_text = Text("C").move_to(ellipse3.get_center())
        subset3_text = MathTex(r"C \subseteq A", font_size=36).next_to(ellipse3, UP)
        self.play(FadeIn(ellipse3_text), FadeIn(subset3_text))

        self.wait(3)



# manim -pql --format gif --fps 30 bool_ops_subset.py BooleanOperationsSubset