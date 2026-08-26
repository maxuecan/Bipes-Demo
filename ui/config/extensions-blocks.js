let turtle = require('./turtle.png')
let oled = require('./oled.png')

module.exports = [
  {
    type: 'turtle',
    name: '海龟函数',
    image: turtle,
    key: 'turtle',
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
  {
    type: 'hardware',
    name: '显示屏',
    image: oled,
    key: 'monitor',
    remark: '0.96寸显示屏使用',
    xml: `
      <category name="显示屏">
        <block type="oled_clear"></block>
        <block type="oled_show"></block>
        <block type="oled_text8">
          <value name="text">
            <shadow type="text">
              <field name="TEXT">Hello</field>
            </shadow>
          </value>
          <value name="x">
            <shadow type="math_number">
              <field name="NUM">0</field>
            </shadow>
          </value>
          <value name="y">
            <shadow type="math_number">
              <field name="NUM">0</field>
            </shadow>
          </value>
        </block>
        <block type="oled_text16">
          <value name="text">
            <shadow type="text">
              <field name="TEXT">欢迎光临</field>
            </shadow>
          </value>
          <value name="x">
            <shadow type="math_number">
              <field name="NUM">0</field>
            </shadow>
          </value>
          <value name="y">
            <shadow type="math_number">
              <field name="NUM">0</field>
            </shadow>
          </value>
        </block>
        <block type="oled_text_scroll">
          <value name="text">
            <shadow type="text">
              <field name="TEXT">欢迎光临</field>
            </shadow>
          </value>
          <value name="y">
            <shadow type="math_number">
              <field name="NUM">0</field>
            </shadow>
          </value>
        </block>
      </category>
    `
  },
  {
    type: 'hardware',
    name: '输入/输出',
    image: oled,
    key: 'led',
    remark: 'LED 灯条',
    xml: `
        <category name="输入/输出">
            <block type="io_rate"></block>
            <block type="io_init_pin">
                <value name="PIN">
                    <shadow type="text">pin</shadow>
                </value>
                <value name="NUM">
                    <block type="io_pin"></block>
                </value>
            </block>
            <block type="io_pinout_set">
                <value name="PIN">
                    <block type="io_pinvar"></block>
                </value>
                <value name="RATE">
                    <block type="io_rate"></block>
                </value>
            </block>
            <block type="io_pinin_set">
                <value name="PIN">
                    <block type="io_pinvar"></block>
                </value>
            </block>
            <block type="io_init_pin_in">
                <value name="PIN"> 
                    <shadow type="text">
                        <field name="TEXT">abc</field>
                    </shadow>
                </value>
                <value name="NUM">
                    <block type="io_pin"></block>
                </value>
            </block>
            <block type="io_in_voltage">
                <value name="PIN">
                    <block type="io_pinpro"></block>
                </value>
            </block>
            <block type="io_in_get">
                <value name="PIN">
                    <block type="io_pinpro"></block>
                </value>
            </block>
            <block type="io_init_pwmout_set">
                <value name="PIN"> 
                    <shadow type="text">
                        <field name="TEXT">pwm</field>
                    </shadow>
                </value>
            </block>
            <block type="io_pwmout_set">
                <value name="PIN">
                    <block type="io_pinpwm"></block>
                </value>
                <value name="RATE">
                    <shadow type="math_number">
                        <field name="NUM">0</field>
                    </shadow>
                </value>
            </block>
            <block type="io_pwmout_rate_set">
                <value name="PIN">
                    <block type="io_pinpwm"></block>
                </value>
                <value name="RATE">
                    <shadow type="math_number">
                        <field name="NUM">2000</field>
                    </shadow>
                </value>
            </block>
            <block type="io_init_touch_sensor_set">
                <value name="PIN"> 
                    <shadow type="text">
                        <field name="TEXT">tc</field>
                    </shadow>
                </value>
                <value name="TATE">
                    <block type="io_pin"></block>
                </value>
            </block>
            <block type="io_touch_sensor_get"></block>
            <block type="io_stop">
                <value name="PIN">
                    <block type="io_pin"></block>
                </value>
                <value name="FUNC"> 
                    <shadow type="text">
                        <field name="TEXT">attachInterrupt_func</field>
                    </shadow>
                </value>
            </block>
        </category>
    `
  }
]
