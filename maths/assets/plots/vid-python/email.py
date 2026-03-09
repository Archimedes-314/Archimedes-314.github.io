from manim import *

class ArchimedessScene(Scene):
    def construct(self):
        self.camera.background_color = "#FBFBF8"

        primary_text_color = "#1C1C1C"
        accent_gold = "#C6A75E"

        # --- Title ---
        title = Text(
            "Ο Αρχιμήδης Είναι Φοβερός",
            font_size=60,
            color=primary_text_color
        )
        title.to_edge(UP, buff=0.9)

        self.play(Write(title), run_time=1.6)

        # --- Gold Rule ---
        rule = Line(
            LEFT*4,
            RIGHT*4,
            color=accent_gold,
            stroke_width=3
        )
        rule.next_to(title, DOWN, buff=0.4)

        self.play(GrowFromCenter(rule), run_time=1.0)

        # --- Quote ---
        quote = Tex(
            r"\textit{“Give me a lever long enough and a fulcrum on which to place it,}\\"
            r"\textit{and I shall move the world.”}",
            font_size=34,
            color=primary_text_color
        )

        quote.next_to(rule, DOWN, buff=0.9)

        self.play(Write(quote), run_time=2.0)

        # --- Attribution ---
        attribution = Tex(
            r"--- Archimedes (c.\ 287--212 BC)",
            font_size=26,
            color=primary_text_color
        )

        attribution.next_to(quote, DOWN, buff=0.5)
        attribution.align_to(quote, RIGHT)

        self.play(FadeIn(attribution, shift=UP*0.1), run_time=1.2)

        self.wait(2)

        self.play(
            FadeOut(attribution, shift=DOWN*0.2),
            FadeOut(quote, shift=DOWN*0.2),
            FadeOut(rule),
            FadeOut(title, shift=DOWN*0.2),
            run_time=1.5
        )
