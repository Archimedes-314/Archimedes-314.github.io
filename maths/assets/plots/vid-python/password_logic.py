from manim import *

class PasswordLogic(Scene):
    def construct(self):
        # 1. Helper functions
        def get_labeled_box(text, width=3, height=2, corner=0.6, font_size=36, color=BLUE):
            box = RoundedRectangle(
                corner_radius=corner, 
                fill_color=color, 
                fill_opacity=0.8, 
                width=width, 
                height=height
            )
            label = Paragraph(
                *text.split(),
                font_size=font_size,
                alignment="center"
            )
            return VGroup(box, label)
        
        def draw_line_from(start_point, end_point):
             return Line(
                start_point.get_edge_center(RIGHT),
                end_point.get_edge_center(LEFT)
            )


        # 2. Input Bpxes
        username_grp = get_labeled_box("Username Provided").move_to([-5.5, 2, 0])
        password_grp = get_labeled_box("Password Provided").move_to([-5.5, -2, 0])

        self.play(Write(username_grp), Write(password_grp))
        self.wait(0.1)

        # 3. Validation Options
        opt_config = {"width": 2, "height": 1, "corner": 0.2, "font_size": 24}
        
        c_user = get_labeled_box("Correct Username", **opt_config, color=GREEN).move_to([-2, 3, 0])
        i_user = get_labeled_box("Incorrect Username", **opt_config, color=RED).move_to([-2, 1, 0])
        c_pass = get_labeled_box("Correct Password", **opt_config, color=GREEN).move_to([-2, -1, 0])
        i_pass = get_labeled_box("Incorrect Password", **opt_config, color=RED).move_to([-2, -3, 0])

        self.play(
            *[Write(obj) for obj in [c_user, i_user, c_pass, i_pass]]
        )
        self.wait(0.1)

        # 4. Validation Lines
        c_user_line = draw_line_from(username_grp, c_user)
        i_user_line = draw_line_from(username_grp, i_user)
        c_pass_line = draw_line_from(password_grp, c_pass)
        i_pass_line = draw_line_from(password_grp, i_pass)

        self.play(
            *[Write(obj) for obj in [c_user_line, i_user_line, c_pass_line, i_pass_line]]
        )

        # 6. Logic Boxes
        and_box = get_labeled_box("AND", **opt_config, color=GREEN).move_to([2, 2, 0])
        or_box = get_labeled_box("OR", **opt_config, color=RED).move_to([2, -2, 0])

        self.play(Write(and_box), Write(or_box))
        self.wait(0.1)

        # 7. Logic Lines
        user_and_line = draw_line_from(c_user, and_box)
        pass_and_line = draw_line_from(c_pass, and_box)
        user_or_line = draw_line_from(i_user, or_box)
        pass_or_line = draw_line_from(i_pass, or_box)

        self.play(
            *[Write(obj) for obj in [user_and_line, pass_and_line, user_or_line, pass_or_line]]
        )

        # 8. Result
        and_result = get_labeled_box("Logged In").move_to([5.5, 2, 0])
        or_result = get_labeled_box("Incorrect Username/ Password").move_to([5.5, -2, 0])
        
        self.play(Write(and_result), Write(or_result))

        # 9. Result Lines
        logged_in_line = draw_line_from(and_box, and_result)
        error_line = draw_line_from(or_box, or_result)

        self.play(
            Write(logged_in_line),
            Write(error_line)
        )

        self.wait(15)
        self.play(*[FadeOut(mob) for mob in self.mobjects])