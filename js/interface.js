// Generated by CoffeeScript 1.3.3
(function() {
  var get_random_float_between, get_random_int_between;

  window.gui = {};

  get_random_float_between = function(min, max) {
    return Math.random() * (max - min) + min;
  };

  get_random_int_between = function(min, max) {
    return Math.round(get_random_float_between(min, max));
  };

  gui.Scenario = (function() {

    function Scenario(total_days) {
      this.total_days = total_days != null ? total_days : 3;
      this.node = $('#scenario');
      this.scene_node = $('.scene', this.node);
      this.prompt_node = $('.prompt', this.node);
      this.round_node = $('.round', this.node);
    }

    Scenario.prototype.set_scene = function(day_num, description, callback) {
      var _this = this;
      $('.days_remaining', this.scene_node).text(this.total_days - day_num);
      $('.day_count', this.scene_node).append("<img src=\"img\/day_" + day_num + ".png\" class=\"temp\">");
      $('p.description', this.scene_node).text(description);
      this.node.css("visibility", "visibile");
      return this.scene_node.css({
        opacity: 0,
        visibility: "visible"
      }).animate({
        opacity: 1
      }, 300, function() {
        if (typeof callback === "function") {
          return callback();
        }
      });
    };

    Scenario.prototype.hide_scene = function(callback) {
      var _this = this;
      return this.scene_node.animate({
        opacity: 0
      }, 300, function() {
        $('.days_remaining', _this.scene_node).text("");
        $('.day_count', _this.scene_node).children('.temp').remove();
        $('p.description', _this.scene_node).text("");
        _this.node.css("visibility", "hidden");
        if (typeof callback === "function") {
          return callback();
        }
      });
    };

    Scenario.prototype.show_prompt = function(prompt, callback, is_kylie) {
      var _this = this;
      if (is_kylie == null) {
        is_kylie = true;
      }
      this.node.css("visibility", "visible");
      $('.call .message', this.prompt_node).html(prompt);
      $('.call .avatar', this.prompt_node).removeClass("raul");
      if (!is_kylie) {
        $('.call .avatar', this.prompt_node).addClass("raul");
      }
      return this.prompt_node.css({
        visibility: "visible",
        opacity: 0
      }).animate({
        opacity: 1
      }, 300, function() {
        if (typeof callback === "function") {
          return callback();
        }
      });
    };

    Scenario.prototype.hide_prompt = function() {
      var _this = this;
      return this.prompt_node.animate({
        opacity: 0
      }, 300, function() {
        $('.call .message', _this.prompt_node).text("");
        _this.prompt_node.css("visibility", "hidden");
        if (typeof callback === "function") {
          return callback();
        }
      });
    };

    Scenario.prototype.start_round = function(round_num, callback) {
      var flirt, flirt_wait_time, round_count, round_fade_time, round_wait_time,
        _this = this;
      round_count = $('.round_count', this.round_node);
      flirt = $('.flirt', this.round_node);
      round_count.append("<img src=\"img/round_" + round_num + ".png\">");
      round_count.css({
        visibility: "visible",
        opacity: 0
      });
      flirt.css("visibility", "hidden");
      this.node.css("visibility", "visible");
      this.round_node.css("visibility", "visible");
      round_fade_time = 250;
      round_wait_time = 1000;
      flirt_wait_time = 600;
      return round_count.animate({
        opacity: 1
      }, round_fade_time, function() {
        return setTimeout(function() {
          return round_count.animate({
            opacity: 0
          }, round_fade_time, function() {
            round_count.empty();
            round_count.css("visibility", "hidden");
            flirt.css("visibility", "visible");
            return setTimeout(function() {
              flirt.css("visibility", "hidden");
              _this.round_node.css("visibility", "hidden");
              _this.node.css("visibility", "hidden");
              if (typeof callback === "function") {
                return callback();
              }
            }, flirt_wait_time);
          });
        }, round_wait_time);
      });
    };

    return Scenario;

  })();

  gui.ChoiceList = (function() {

    function ChoiceList(num_options) {
      this.num_options = num_options != null ? num_options : 6;
      this.node = $('#choices');
      this.width = this.node.width();
      this.height = this.node.height();
      this.choices = [];
      this.create_options();
    }

    ChoiceList.prototype.create_options = function() {
      var i, node, _i, _ref, _results;
      _results = [];
      for (i = _i = 0, _ref = this.num_options; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
        node = $('<li class="choice" data-id="' + i + '"></li>');
        this.node.append(node);
        _results.push(this.choices.push(new gui.Choice(node, this)));
      }
      return _results;
    };

    ChoiceList.prototype.name_option = function(num, text) {
      return this.choices[num].change_text(text);
    };

    ChoiceList.prototype.remove_option = function(num) {
      return this.choices[num].remove();
    };

    ChoiceList.prototype.on_option_click = function(callback) {
      return this.node.children('li.choice').bind("mousedown", function(event) {
        AUDIO.play('sfx', 'button_click');
        return callback($(event.target).attr('data-id'));
      });
    };

    ChoiceList.prototype.place_options = function() {
      var choice, _i, _len, _ref, _results;
      _ref = this.choices;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        choice = _ref[_i];
        _results.push(choice.place_randomly());
      }
      return _results;
    };

    ChoiceList.prototype.move = function() {
      var choice, _i, _len, _ref, _results;
      this.should_be_moving = true;
      _ref = this.choices;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        choice = _ref[_i];
        _results.push(choice.move());
      }
      return _results;
    };

    ChoiceList.prototype.stop = function(selected_option_num, callback) {
      var choice, choice_offset, clone,
        _this = this;
      this.should_be_moving = false;
      choice = this.choices[selected_option_num];
      choice_offset = choice.node.offset();
      clone = choice.node.clone();
      $('body').append(clone);
      clone.css({
        left: choice_offset.left,
        top: choice_offset.top,
        margin: 0
      });
      return this.node.animate({
        opacity: 0
      }, 200, function() {
        _this.node.css({
          visibility: "hidden"
        });
        return clone.animate({
          top: "-=20px"
        }, 200, function() {
          clone.addClass("highlight");
          return setTimeout(function() {
            if (typeof callback === "function") {
              callback();
            }
            return clone.remove();
          }, 1000);
        });
      });
    };

    ChoiceList.prototype.go = function() {
      var choice, _i, _len, _ref;
      _ref = this.choices;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        choice = _ref[_i];
        choice.node.css({
          left: "-1000px",
          top: "-1000px"
        });
      }
      this.place_options();
      this.move();
      return this.node.css({
        visibility: "visibile",
        opacity: 1
      });
    };

    return ChoiceList;

  })();

  gui.Choice = (function() {

    function Choice(node, choice_list) {
      this.node = node;
      this.choice_list = choice_list;
      this.x = 0;
      this.y = 0;
      this.vel = 5;
      this.set_size_explicit();
      this.set_random_direction();
    }

    Choice.prototype.remove = function() {
      return this.node.css("visibility", "hidden");
    };

    Choice.prototype.set_size_explicit = function() {
      this.node.css({
        width: this.node.width(),
        height: this.node.height()
      });
      this.width = this.node.outerWidth(true);
      return this.height = this.node.outerHeight(true);
    };

    Choice.prototype.change_text = function(text) {
      this.node.text(text);
      this.node.css({
        width: "auto",
        height: "auto"
      });
      return this.set_size_explicit();
    };

    Choice.prototype.move = function() {
      var do_movement,
        _this = this;
      this.node.css("visibility", "visible");
      if (this.movement_interval) {
        clearInterval(this.movement_interval);
      }
      do_movement = function() {
        var x, y;
        x = _this.x + _this.vector_x;
        y = _this.y + _this.vector_y;
        if (_this.is_valid_location(x, y)) {
          _this.place_at(x, y);
        } else {
          _this.set_random_direction();
          do_movement();
        }
      };
      return this.movement_interval = setInterval(function() {
        if (_this.choice_list.should_be_moving) {
          return do_movement();
        } else {
          return clearInterval(_this.movement_interval);
        }
      }, 50);
    };

    Choice.prototype.set_random_direction = function() {
      this.vector_x = get_random_float_between(-this.vel, this.vel);
      return this.vector_y = Math.random() > 0.5 ? this.vel - Math.abs(this.vector_x) : -(this.vel - Math.abs(this.vector_x));
    };

    Choice.prototype.is_valid_location = function(x, y) {
      if (x < 0 || this.choice_list.width - this.width < x) {
        return false;
      }
      if (y < 0 || this.choice_list.height - this.height < y) {
        return false;
      }
      if (this.check_for_collision(x, y)) {
        return false;
      }
      return true;
    };

    Choice.prototype.check_for_collision = function(x, y) {
      var a_bottom, a_left, a_right, a_top, b_bottom, b_left, b_right, b_top, choice, _i, _len, _ref;
      a_left = x;
      a_top = y;
      a_right = x + this.width;
      a_bottom = y + this.height;
      _ref = this.choice_list.choices;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        choice = _ref[_i];
        if (choice === this) {
          continue;
        }
        b_left = choice.x;
        b_top = choice.y;
        b_right = choice.x + choice.width;
        b_bottom = choice.y + choice.height;
        if (!(a_left > b_right || a_right < b_left || a_top > b_bottom || a_bottom < b_top)) {
          return true;
        }
      }
      return false;
    };

    Choice.prototype.place_at = function(x, y) {
      this.x = x;
      this.y = y;
      return this.node.css({
        left: x,
        top: y
      });
    };

    Choice.prototype.place_randomly = function() {
      var count, is_placed, try_to_place,
        _this = this;
      is_placed = false;
      try_to_place = function() {
        var x, y;
        x = get_random_int_between(0, _this.choice_list.width - _this.width);
        y = get_random_int_between(0, _this.choice_list.height - _this.height);
        if (!_this.check_for_collision(x, y)) {
          _this.place_at(x, y);
          return is_placed = true;
        }
      };
      count = 100;
      while (!is_placed) {
        try_to_place();
        count--;
        if (count === 0) {
          break;
        }
      }
    };

    return Choice;

  })();

  gui.HeartMeter = (function() {

    function HeartMeter(total, current) {
      this.total = total != null ? total : 100;
      this.current = current != null ? current : 0;
      this.node = $('#kylie_info');
      this.bar_node_full = $('.fill', this.node);
      this.bar_node_temp = $('.diff', this.node);
      this.feedback_node = $('.feedback', this.node);
      this.set_bar_width(this.get_percentage());
      this.set_bar_temp_width(0);
    }

    HeartMeter.prototype.get_percentage = function() {
      return Math.round(this.current / this.total * 100);
    };

    HeartMeter.prototype.set_bar_width = function(amt) {
      return this.bar_node_full.css("width", "" + amt + "%");
    };

    HeartMeter.prototype.set_bar_temp_width = function(amt) {
      return this.bar_node_temp.css("width", "" + amt + "px");
    };

    HeartMeter.prototype.modify = function(delta, max) {
      var pct;
      pct = 100 * delta / max;
      if (delta < 0) {
        this.decrease(-1 * pct);
        return this.show_broken_heart(-1 * delta);
      } else {
        this.increase(pct);
        return this.show_heart(delta);
      }
    };

    HeartMeter.prototype.increase = function(amt) {
      var old_width, percentage_jump, width_diff,
        _this = this;
      amt = Math.min(amt, this.total - this.current);
      percentage_jump = amt / this.total * 100;
      this.current += amt;
      old_width = this.bar_node_full.width();
      this.set_bar_width(this.get_percentage());
      width_diff = this.bar_node_full.width() - old_width;
      this.set_bar_temp_width(width_diff);
      return setTimeout(function() {
        return _this.bar_node_temp.animate({
          width: "0"
        }, 300, "linear");
      }, 500);
    };

    HeartMeter.prototype.decrease = function(amt) {
      var new_percentage, old_percentage, old_width, percentage_drop, width_diff,
        _this = this;
      amt = Math.min(amt, this.current);
      percentage_drop = amt / this.total * 100;
      old_percentage = this.get_percentage();
      old_width = this.bar_node_full.width();
      this.current -= amt;
      new_percentage = this.get_percentage();
      this.set_bar_width(new_percentage);
      width_diff = old_width - this.bar_node_full.width();
      this.set_bar_width(old_percentage);
      this.set_bar_temp_width(width_diff);
      return setTimeout(function() {
        _this.bar_node_temp.animate({
          width: "0px"
        }, 300, "linear");
        return _this.bar_node_full.animate({
          width: "" + new_percentage + "%"
        }, 300, "linear");
      }, 500);
    };

    HeartMeter.prototype.show_heart = function(amt) {
      var heart, text,
        _this = this;
      heart = $('<div class="heart"></div>');
      text = $("<div class=\"score\">+" + amt + "</div>");
      this.feedback_node.append(heart);
      this.feedback_node.append(text);
      return setTimeout(function() {
        heart.animate({
          opacity: 0,
          top: "-12px"
        }, 300, function() {
          return $(this).remove();
        });
        return text.animate({
          opacity: 0
        }, 300, function() {
          return $(this).remove();
        });
      }, 500);
    };

    HeartMeter.prototype.show_broken_heart = function(amt) {
      var heart, text,
        _this = this;
      heart = $('<div class="heart_broken"></div>');
      text = $("<div class=\"score\">-" + amt + "</div>");
      this.feedback_node.append(heart);
      this.feedback_node.append(text);
      return setTimeout(function() {
        heart.animate({
          opacity: 0,
          top: "48px"
        }, 300, function() {
          return $(this).remove();
        });
        return text.animate({
          opacity: 0
        }, 300, function() {
          return $(this).remove();
        });
      }, 500);
    };

    HeartMeter.prototype.update_score = function(amt) {
      if (amt === 15) {
        AUDIO.play('sfx', 'perfect');
      } else if (amt === -10) {
        AUDIO.play('sfx', 'offensive_effect');
      } else if (amt <= 0) {
        AUDIO.play('sfx', 'giggle');
      } else if (amt > 0) {
        AUDIO.play('sfx', 'neutral_effect');
      }
      if (amt > 0) {
        this.increase(amt);
        return this.show_heart(amt);
      } else if (amt < 0) {
        this.decrease(Math.abs(amt));
        return this.show_broken_heart(amt);
      } else {
        return console.log("Do anything for 0 points?");
      }
    };

    return HeartMeter;

  })();

  gui.Timer = (function() {

    function Timer() {
      this.node = $('#timer');
    }

    Timer.prototype.set = function(num) {
      var number, numbers, _i, _len, _results;
      this.node.empty();
      num = Math.round(num);
      numbers = num.toString().split("");
      _results = [];
      for (_i = 0, _len = numbers.length; _i < _len; _i++) {
        number = numbers[_i];
        _results.push(this.node.append($("<img src=\"./img/count_" + number + ".png\"></img>")));
      }
      return _results;
    };

    Timer.prototype.hide = function() {
      var _this = this;
      return this.node.animate({
        opacity: 0
      }, 300, function() {
        return _this.node.css({
          visibility: "hidden",
          opacity: 1
        });
      });
    };

    Timer.prototype.show = function() {
      return this.node.css("visibility", "visible");
    };

    return Timer;

  })();

}).call(this);
