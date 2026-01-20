let turtle = require('./turtle.png')

module.exports = [
  {
    type: 'turtle',
    name: '海龟函数',
    image: turtle,
    remark: '可以调用海龟编辑器中对应Python函数。',
    xml: `
            <category name="海龟" colour="%{BKY_TURTLE_HUE}">
                <block type="variables_set" id="fg004w+XJ=maCm$V7?3T" x="238" y="138">
                    <field name="VAR" id="dfa$SFe(HK(10)Y+T-bS">海龟</field>
                    <value name="VALUE">
                        <block type="turtle_create" id="Hv^2jr?;yxhA=%oCs1=d"></block>
                    </value>
                </block>
                <block type="turtle_create"></block>
                <block type="turtle_move">
                    <value name="VALUE">
                        <block type="variables_get">
                            <field name="VAR">{turtleVariable}</field>
                        </block>
                    </value>
                    <value name="distance">
                        <shadow type="math_number">
                            <field name="NUM">50</field>
                        </shadow>
                    </value>
                </block>
                <block type="turtle_rotate">
                    <value name="VALUE">
                        <block type="variables_get">
                            <field name="VAR">{turtleVariable}</field>
                        </block>
                    </value>
                    <value name="angle">
                        <shadow type="math_number">
                            <field name="NUM">90</field>
                        </shadow>
                    </value>
                </block>
            <block type="turtle_move_xy">
                <value name="VALUE">
                    <block type="variables_get">
                        <field name="VAR">{turtleVariable}</field>
                    </block>
                </value>
                <value name="x">
                    <shadow type="math_number">
                        <field name="NUM">50</field>
                    </shadow>
                </value>
                <value name="y">
                    <shadow type="math_number">
                        <field name="NUM">50</field>
                    </shadow>
                </value>
            </block>
            <block type="turtle_set_position">
                <value name="VALUE">
                    <block type="variables_get">
                        <field name="VAR">{turtleVariable}</field>
                    </block>
                </value>
                <value name="position">
                    <shadow type="math_number">
                        <field name="NUM">50</field>
                    </shadow>
                </value>
            </block>
            <block type="turtle_draw_circle">
                <value name="VALUE">
                    <block type="variables_get">
                        <field name="VAR">{turtleVariable}</field>
                    </block>
                </value>
                <value name="radius">
                    <shadow type="math_number">
                        <field name="NUM">50</field>
                    </shadow>
                </value>
                <value name="extent">
                    <shadow type="math_number">
                        <field name="NUM">50</field>
                    </shadow>
                </value>
                <value name="steps">
                    <shadow type="math_number">
                        <field name="NUM">50</field>
                    </shadow>
                </value>
            </block>
            <block type="turtle_draw_polygon">
                <value name="VALUE">
                    <block type="variables_get">
                        <field name="VAR">{turtleVariable}</field>
                    </block>
                </value>
                <value name="num_sides">
                    <shadow type="math_number">
                        <field name="NUM">5</field>
                    </shadow>
                </value>
                <value name="radius">
                    <shadow type="math_number">
                        <field name="NUM">30</field>
                    </shadow>
                </value>
            </block>
            <block type="turtle_draw_point">
                <value name="VALUE">
                    <block type="variables_get">
                        <field name="VAR">{turtleVariable}</field>
                    </block>
                </value>
                <value name="diameter">
                    <shadow type="math_number">
                        <field name="NUM">50</field>
                    </shadow>
                </value>
            </block>
            <block type="turtle_write">
                <value name="VALUE">
                    <block type="variables_get">
                        <field name="VAR">{turtleVariable}</field>
                    </block>
                </value>
                <value name="text">
                    <shadow type="text">
                        <field name="TEXT">Hello</field>
                    </shadow>
                </value>
            </block>
            <block type="turtle_set_heading">
                <value name="VALUE">
                    <block type="variables_get">
                        <field name="VAR">{turtleVariable}</field>
                    </block>
                </value>
                <value name="angle">
                    <shadow type="math_number">
                        <field name="NUM">90</field>
                    </shadow>
                </value>
            </block>
            <block type="turtle_pendown">
                <value name="VALUE">
                    <block type="variables_get">
                        <field name="VAR">{turtleVariable}</field>
                    </block>
                </value>
            </block>
            <block type="turtle_set_pensize">
                <value name="VALUE">
                    <block type="variables_get">
                        <field name="VAR">{turtleVariable}</field>
                    </block>
                </value>
                <value name="size">
                    <shadow type="math_number">
                        <field name="NUM">5</field>
                    </shadow>
                </value>
            </block>
            <block type="turtle_set_speed">
                <value name="VALUE">
                    <block type="variables_get">
                        <field name="VAR">{turtleVariable}</field>
                    </block>
                </value>
                <value name="speed">
                    <shadow type="math_number">
                        <field name="NUM">5</field>
                    </shadow>
                </value>
            </block>
            <block type="turtle_get_position">
                <value name="VALUE">
                    <block type="variables_get">
                        <field name="VAR">{turtleVariable}</field>
                    </block>
                </value>
            </block>
            <block type="turtle_show_hide">
                <value name="VALUE">
                    <block type="variables_get">
                        <field name="VAR">{turtleVariable}</field>
                    </block>
                </value>
            </block>
            <block type="turtle_clear">
                <value name="VALUE">
                    <block type="variables_get">
                        <field name="VAR">{turtleVariable}</field>
                    </block>
                </value>
            </block>
            <block type="turtle_stop">
                <value name="VALUE">
                    <block type="variables_get">
                        <field name="VAR">{turtleVariable}</field>
                    </block>
                </value>
            </block>
            <block type="turtle_set_bgcolor">
                <value name="COLOUR">
                    <block type="colour_picker"></block>
                </value>
            </block>
            <block type="turtle_set_pencolor">
                <value name="VALUE">
                    <block type="variables_get">
                        <field name="VAR">{turtleVariable}</field>
                    </block>
                </value>
                <value name="COLOUR">
                    <block type="colour_picker"></block>
                </value>
            </block>
            <block type="turtle_set_fillcolor">
                <value name="VALUE">
                    <block type="variables_get">
                        <field name="VAR">{turtleVariable}</field>
                    </block>
                </value>
                <value name="COLOUR">
                    <block type="colour_picker"></block>
                </value>
            </block>

            <block type="turtle_set_colormode">
                <value name="VALUE">
                    <block type="variables_get">
                        <field name="VAR">{turtleVariable}</field>
                    </block>
                </value>
                <value name="COLOUR">
                    <shadow type="math_number">
                        <field name="NUM">255</field>
                    </shadow>
                </value>
            </block>
            <block type="turtle_set_fill">
                <value name="VALUE">
                    <block type="variables_get">
                        <field name="VAR">{turtleVariable}</field>
                    </block>
                </value>
            </block>
            <block type="turtle_set_color">
                <value name="VALUE">
                    <block type="variables_get">
                        <field name="VAR">{turtleVariable}</field>
                    </block>
                </value>
                <value name="COLOUR">
                    <block type="colour_picker"></block>
                </value>
            </block>
        </category>
        `,
  },
]
