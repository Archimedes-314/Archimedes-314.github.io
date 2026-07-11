from manim import *

class RingtoneLogic(Scene):
    def construct(self):
        # Incoming Call Box
        incoming_call_box = RoundedRectangle(
            corner_radius = 0.6,
            fill_color = BLUE,
            fill_opacity = 0.8
        )

        incoming_call_label = Paragraph(
            "Incoming", "Call", 
            font_size = 36, 
            alignment = "center"
        ).move_to(incoming_call_box.get_center())

        incoming_call_group = VGroup(incoming_call_box, incoming_call_label)

        self.play(Write(incoming_call_group))
        self.play(Wiggle(incoming_call_group, run_time=2))
        self.wait(0.1)
        self.play(
            incoming_call_group.animate.scale(0.8).move_to([-4, 2.5, 0])
        )

        # If Silent Mode Box
        if_box = RoundedRectangle(
            corner_radius = 0.6,
            fill_color = BLUE,
            fill_opacity = 0.8
        )

        if_label = Paragraph(
            "If   Silent", "Mode",
            font_size = 36,
            alignment = "center"
        ).move_to(if_box.get_center())

        if_group = VGroup(if_box, if_label).scale(0.8).move_to(UP * 0.5)

        if_curve = ArcBetweenPoints(
            incoming_call_group.get_edge_center(RIGHT),
            if_group.get_edge_center(UP),
            angle = -TAU/5
        )

        # Play Ringtone Box
        play_ringtone_box = RoundedRectangle(
            corner_radius = 0.6,
            fill_color = BLUE,
            fill_opacity = 0.8
        ).move_to(DOWN * 2 + LEFT * 2)
        
        play_ringtone_label = Paragraph(
            "Play", "Ringtone",
            font_size = 36,
            alignment = "center"
        ).move_to(play_ringtone_box.get_center())

        play_ringtone_group = VGroup(play_ringtone_box, play_ringtone_label).scale(0.8)

        play_ringtone_line = Line(
            if_group.get_edge_center(DOWN),
            play_ringtone_group.get_edge_center(UP),
        )

        # Don't Play Ringtone Box
        dont_play_ringtone_box = RoundedRectangle(
            corner_radius = 0.6,
            fill_color = BLUE,
            fill_opacity = 0.8
        ).move_to(DOWN * 2 + RIGHT * 2)
        
        dont_play_ringtone_label = Paragraph(
            "Don't   Play", "Ringtone",
            font_size = 36,
            alignment = "center"
        ).move_to(dont_play_ringtone_box.get_center())

        dont_play_ringtone_group = VGroup(dont_play_ringtone_box, dont_play_ringtone_label).scale(0.8)

        dont_play_ringtone_line = Line(
            if_group.get_edge_center(DOWN),
            dont_play_ringtone_group.get_edge_center(UP),
        )

        self.play(
            Write(if_group),
            Write(play_ringtone_group),
            Write(dont_play_ringtone_group),
            run_time = 2
        )
        self.play(Write(if_curve))
        self.play(Write(play_ringtone_line), Write(dont_play_ringtone_line))

        # If Results

        true_label = Text(
            "IF TRUE",
            font_size = 24
        ).next_to(
            dont_play_ringtone_line,
            RIGHT,
            buff = 0.1
        )

        false_label = Text(
            "IF FALSE",
            font_size = 24
        ).next_to(
            play_ringtone_line,
            LEFT,
            buff = 0.1
        )

        self.play(
            FadeIn(true_label),
            FadeIn(false_label),
            dont_play_ringtone_box.animate.set_fill(GREEN),
            play_ringtone_box.animate.set_fill(RED)
        )

        self.wait(10)
        self.play(*[FadeOut(mob) for mob in self.mobjects])