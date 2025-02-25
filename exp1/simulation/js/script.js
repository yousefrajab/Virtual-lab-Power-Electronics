var correct_connections = [
  ["DC2T", "R2L"],
  ["VM2T", "R2L"],
  ["DC2B", "GND1T"],
  ["VM2B", "GND1T"],
  ["IGBT1B", "GND1T"],
  ["R2R", "IGBT1L"],
  ["IGBT1T", "AM1L"],
  ["AM1R", "R1L"],
  ["R1R", "DC1T"],
  ["DC1B", "GND1T"],
  ["VM1T", "R1L"],
  ["VM1B", "GND1T"],
];
var colors = ["red", "blue", "green"];
var plot_data_points = [
  {
    x: [0],
    y: [0],
    mode: "lines",
    name: "",
    marker: {
      color: "White",
    },
  },
];
const xval = [0, 1, 2, 3, 4, 5, 6, 7];
const data = {
  vge55: [0, 3.5, 3.5, 3.5, 3.5, 3.6, 3.6, 3.6],
  vge57: [0, 14.5, 14.7, 14.8, 14.9, 15.1, 15.5, 15.8],
  vge60: [0, 58, 60, 61, 62, 64, 65, 68],
};
var resistorids = ["R2-back", "R1-back"];
var dcids = ["DC1-back", "DC2-back"];
var groundids = ["GND1-back"];
var voltagemids = ["VM1-back", "VM2-back"];
var gatepluseids = ["AM1-back"];
var igbtids = ["IGBT1-back"];
var values = {
  IGBT1: { name: "IGBT" },
  DC1: { name: "VCC", value: 0, unit: " V" },
  DC2: { name: "VGG", value: 0, unit: " V" },
  VM1: { name: "VCE" },
  VM2: { name: "VGE" },
  AM1: { name: "IC" },
  R1: { name: "RC", value: 0, unit: " Ω" },
  R2: { name: "RG", value: 0, unit: " Ω" },
  GND1: { name: "GND" },
  freq: 0,
  unit: " Hz",
};
var endpoints = {};
var user_connection = [];
var endpoints_display = [];
var wrong_connection = [];
var previous_reading_current = false;
const values120 = {
  G1: { fire1: 0, fire2: 120 },
  G3: { fire1: 120, fire2: 240 },
  G5: { fire1: 240, fire2: 360 },
  G4: { fire1: 180, fire2: 300 },
  G6: { fire1: 300, fire2: 420 },
  G2: { fire1: 60, fire2: 180 },
};

const values180 = {
  G1: { fire1: 0, fire2: 180 },
  G3: { fire1: 120, fire2: 300 },
  G5: { fire1: 240, fire2: 420 },
  G4: { fire1: 180, fire2: 360 },
  G6: { fire1: 300, fire2: 480 },
  G2: { fire1: 60, fire2: 240 },
};
var dc_defult = {
  d0: "selected",
  d57: "",
  d55: "",
  d60: "",
};
var dc_defult_enabled = {
  d0: "disabled",
  d57: "",
  d55: "",
  d60: "",
};
var dc_vcc_selected = {
  d0: "selected",
  d1: "",
  d2: "",
  d3: "",
  d4: "",
  d5: "",
  d6: "",
  d7: "",
};
var dc_vcc_enabled = {
  d0: "disabled",
  d1: "",
  d2: "disabled",
  d3: "disabled",
  d4: "disabled",
  d5: "disabled",
  d6: "disabled",
  d7: "disabled",
};
var correct_connections_flag = false;
var new_reading = true;
var combination_flag = false;
var combination;
var reading_vge = false;
var first_reading_flag = true;
var new_reading_vge = false;
var new_reading_vce = false;
var new_reading_table = true;
var instance = jsPlumb.getInstance({
  ConnectionsDetachable: false,
  Container: "body",
});
instance.bind("ready", () => {
  $("#symbolpalette .ele-img").draggable({
    helper: "clone",
    containment: "body",
    appendTo: "#diagram",
  });
  $("#diagram").droppable({
    drop: (event, ui) => {
      if ($(ui.helper).hasClass("resistor-sym")) {
        var a = resistorids.pop();
        if (a != null) {
          document.getElementById(a).style.visibility = "unset";
          createParticularEnd(a.split("-")[0]);
          endpoints_display.push(a.split("-")[0]);
        } else {
        }
      } else if ($(ui.helper).hasClass("dc-sym")) {
        var a = dcids.pop();
        if (a != null) {
          document.getElementById(a).style.visibility = "unset";
          createParticularEnd(a.split("-")[0]);
          endpoints_display.push(a.split("-")[0]);
        } else {
        }
      } else if ($(ui.helper).hasClass("volt-sym")) {
        var a = voltagemids.pop();
        if (a != null) {
          document.getElementById(a).style.visibility = "unset";
          createParticularEnd(a.split("-")[0]);
          endpoints_display.push(a.split("-")[0]);
        } else {
        }
      } else if ($(ui.helper).hasClass("gnd-sym")) {
        var a = groundids.pop();
        if (a != null) {
          document.getElementById(a).style.visibility = "unset";
          createParticularEnd(a.split("-")[0]);
          endpoints_display.push(a.split("-")[0]);
        } else {
        }
      } else if ($(ui.helper).hasClass("gate-sym")) {
        var a = gatepluseids.pop();
        if (a != null) {
          document.getElementById(a).style.visibility = "unset";
          createParticularEnd(a.split("-")[0]);
          endpoints_display.push(a.split("-")[0]);
        } else {
        }
      }
      if ($(ui.helper).hasClass("igbt-sym")) {
        var a = igbtids.pop();
        if (a != null) {
          document.getElementById(a).style.visibility = "unset";
          createParticularEnd(a.split("-")[0]);
          endpoints_display.push(a.split("-")[0]);
        } else {
        }
      }
    },
  });
  function createParticularEnd(element_name) {
    var stokwid = 3.5;

    if (element_name == "IGBT1") {
      var IGBT1L = instance.addEndpoint("IGBT1L", {
        anchor: ["Center"],
        isSource: true,
        isTarget: true,
        connector: "Straight",
        maxConnections: 1,
        connectorStyle: { strokeWidth: stokwid, stroke: "#100" },
        paintStyle: { fillStyle: "red" },
      });
      endpoints["IGBT1L"] = IGBT1L;
    }

    if (element_name == "IGBT1") {
      var IGBT1T = instance.addEndpoint("IGBT1T", {
        anchor: ["Top"],
        isSource: true,
        isTarget: true,
        connector: ["Flowchart"],
        maxConnections: 1,
        connectorStyle: { strokeWidth: stokwid, stroke: "#100" },
        paintStyle: { fillStyle: "red" },
      });
      endpoints["IGBT1T"] = IGBT1T;
    }

    if (element_name == "IGBT1") {
      var IGBT1B = instance.addEndpoint("IGBT1B", {
        anchor: ["Bottom"],
        isSource: true,
        isTarget: true,
        connector: ["Flowchart"],
        maxConnections: 1,
        connectorStyle: { strokeWidth: stokwid, stroke: "#100" },
        paintStyle: { fillStyle: "red" },
      });
      endpoints["IGBT1B"] = IGBT1B;
    }

    if (element_name == "VM1") {
      var VM1T = instance.addEndpoint("VM1T", {
        anchor: ["Top"],
        isSource: true,
        isTarget: true,
        connector: ["Flowchart"],
        maxConnections: 1,
        connectorStyle: { strokeWidth: stokwid, stroke: "#100" },
        paintStyle: { fillStyle: "red" },
      });
      endpoints["VM1T"] = VM1T;
    }
    if (element_name == "VM2") {
      var VM2T = instance.addEndpoint("VM2T", {
        anchor: ["Top"],
        isSource: true,
        isTarget: true,
        connector: ["Flowchart"],
        maxConnections: 1,
        connectorStyle: { strokeWidth: stokwid, stroke: "#100" },
        paintStyle: { fillStyle: "red" },
      });
      endpoints["VM2T"] = VM2T;
    }

    if (element_name == "VM1") {
      var VM1B = instance.addEndpoint("VM1B", {
        anchor: ["Bottom"],
        isSource: true,
        isTarget: true,
        connector: ["Flowchart"],
        maxConnections: 1,
        connectorStyle: { strokeWidth: stokwid, stroke: "#100" },
        paintStyle: { fillStyle: "red" },
      });
      endpoints["VM1B"] = VM1B;
    }
    if (element_name == "VM2") {
      var VM2B = instance.addEndpoint("VM2B", {
        anchor: ["Bottom"],
        isSource: true,
        isTarget: true,
        connector: ["Flowchart"],
        maxConnections: 1,
        connectorStyle: { strokeWidth: stokwid, stroke: "#100" },
        paintStyle: { fillStyle: "red" },
      });
      endpoints["VM2B"] = VM2B;
    }

    if (element_name == "R1") {
      var R1L = instance.addEndpoint("R1L", {
        anchor: ["Left"],
        isSource: true,
        isTarget: true,
        connector: ["Flowchart"],
        maxConnections: 2,
        connectorStyle: { strokeWidth: stokwid, stroke: "#100" },
        paintStyle: { fillStyle: "red" },
      });
      endpoints["R1L"] = R1L;
    }
    if (element_name == "R2") {
      var R2L = instance.addEndpoint("R2L", {
        anchor: ["Left"],
        isSource: true,
        isTarget: true,
        connector: ["Flowchart"],
        maxConnections: 2,
        connectorStyle: { strokeWidth: stokwid, stroke: "#100" },
        paintStyle: { fillStyle: "red" },
      });
      endpoints["R2L"] = R2L;
    }

    if (element_name == "R1") {
      var R1R = instance.addEndpoint("R1R", {
        anchor: ["Right"],
        isSource: true,
        isTarget: true,
        connector: ["Flowchart"],
        maxConnections: 1,
        connectorStyle: { strokeWidth: stokwid, stroke: "#100" },
        paintStyle: { fillStyle: "red" },
      });
      endpoints["R1R"] = R1R;
    }
    if (element_name == "R2") {
      var R2R = instance.addEndpoint("R2R", {
        anchor: ["Right"],
        isSource: true,
        isTarget: true,
        connector: ["Flowchart"],
        maxConnections: 1,
        connectorStyle: { strokeWidth: stokwid, stroke: "#100" },
        paintStyle: { fillStyle: "red" },
      });
      endpoints["R2R"] = R2R;
    }
    if (element_name == "DC1") {
      var DC1T = instance.addEndpoint("DC1T", {
        anchor: ["Top"],
        isSource: true,
        isTarget: true,
        connector: ["Flowchart"],
        maxConnections: 1,
        connectorStyle: { strokeWidth: stokwid, stroke: "#100" },
        paintStyle: { fillStyle: "red" },
      });
      endpoints["DC1T"] = DC1T;

      var DC1B = instance.addEndpoint("DC1B", {
        anchor: ["Bottom"],
        isSource: true,
        isTarget: true,
        connector: ["Flowchart"],
        maxConnections: 1,
        connectorStyle: { strokeWidth: stokwid, stroke: "#100" },
        paintStyle: { fillStyle: "red" },
      });
      endpoints["DC1B"] = DC1B;
    }
    if (element_name == "DC2") {
      var DC2T = instance.addEndpoint("DC2T", {
        anchor: ["Top"],
        isSource: true,
        isTarget: true,
        connector: ["Flowchart"],
        maxConnections: 1,
        connectorStyle: { strokeWidth: stokwid, stroke: "#100" },
        paintStyle: { fillStyle: "red" },
      });
      endpoints["DC2T"] = DC2T;

      var DC2B = instance.addEndpoint("DC2B", {
        anchor: ["Bottom"],
        isSource: true,
        isTarget: true,
        connector: ["Flowchart"],
        maxConnections: 1,
        connectorStyle: { strokeWidth: stokwid, stroke: "#100" },
        paintStyle: { fillStyle: "red" },
      });
      endpoints["DC2B"] = DC2B;
    }
    if (element_name == "AM1") {
      var AM1L = instance.addEndpoint("AM1L", {
        anchor: ["Left"],
        isSource: true,
        isTarget: true,
        connector: ["Flowchart"],
        maxConnections: 1,
        connectorStyle: { strokeWidth: stokwid, stroke: "#100" },
        paintStyle: { fillStyle: "red" },
      });
      endpoints["AM1L"] = AM1L;

      var AM1R = instance.addEndpoint("AM1R", {
        anchor: ["Right"],
        isSource: true,
        isTarget: true,
        connector: ["Flowchart"],
        maxConnections: 1,
        connectorStyle: { strokeWidth: stokwid, stroke: "#100" },
        paintStyle: { fillStyle: "red" },
      });
      endpoints["AM1R"] = AM1R;
    }
    if (element_name == "GND1") {
      var GND1T = instance.addEndpoint("GND1T", {
        anchor: ["Top"],
        isSource: true,
        isTarget: true,
        connector: ["Flowchart", { stub: 5 }],
        maxConnections: 5,
        connectorStyle: { strokeWidth: stokwid, stroke: "#100" },
        paintStyle: { fillStyle: "red" },
      });
      endpoints["GND1T"] = GND1T;
    }
  }
  //if (component.hasClass("jtk-connector"))

  window.addEventListener("resize", () => {
    instance.repaintEverything();
    if (correct_connections_flag) {
      plotData();
    }
  });

  instance.bind("connection", (conn, event) => {
    var flag = true;
    let eg1 = [String(conn.sourceId), String(conn.targetId)];

    for (var ele of correct_connections) {
      if (
        (ele[0] == eg1[0] && ele[1] == eg1[1]) ||
        (ele[0] == eg1[1] && ele[1] == eg1[0])
      ) {
        flag = false;

        user_connection.push(eg1);

        break;
      }
    }
    if (flag) {
      conn.connection._jsPlumb.paintStyleInUse.stroke = "red";
      wrong_connection.push(eg1);

      openPopup("new-img/404-error.png", "Wrong Connection", "28px");
    }
  });

  instance.bind("click", function (conn) {
    let eg1 = [String(conn.sourceId), String(conn.targetId)];
    if (!correct_connections_flag) {
      for (var ele of correct_connections) {
        if (
          (ele[0] == eg1[0] && ele[1] == eg1[1]) ||
          (ele[0] == eg1[1] && ele[1] == eg1[0])
        ) {
          user_connection.pop(eg1);
          break;
        }
      }
      for (var ele of wrong_connection) {
        if (
          (ele[0] == eg1[0] && ele[1] == eg1[1]) ||
          (ele[0] == eg1[1] && ele[1] == eg1[0])
        ) {
          wrong_connection.pop(eg1);
          break;
        }
      }
      instance.deleteConnection(conn);
    }
    return false;
  });
  $("body").on("contextmenu", "#components", (event) => {
    event.preventDefault();
  });

  // context menu for resistor
  $("body").on("contextmenu", "#diagram .resistor", function (event) {
    event.preventDefault();
    $("div.custom-menu").remove();
    window.selectedControl = $(this).attr("id");

    if (correct_connections_flag) {
      $(
        '<div class="custom-menu"><div class="name-element"><div class="name-element"><div style="display: flex; justify-content: end; position: relative;top: -4px;height: 28px;margin-bottom: 2px;"><button class="submit fa fa-times cross-btn" id="submit-' +
          window.selectedControl +
          '"></button></div></div></div><form action="#" onsubmit="resisSubmited(' +
          "'" +
          window.selectedControl +
          "'" +
          ')"><div><label for="name-' +
          window.selectedControl +
          '">Name:</label><input type="text" class="set-input-name" id="name-' +
          window.selectedControl +
          '" style="border-radius: 20px; padding:2px;width: 122px;"  maxlength="4" placeholder="  ' +
          values[window.selectedControl]["name"] +
          '" onchange="changeName(' +
          "'" +
          window.selectedControl +
          "'" +
          ',this.value)"/></div><div    class="value-element" style="display: flex; align-items: center;"><label for="value-' +
          window.selectedControl +
          '">Resistance:</label><input type="number" class="set-input" placeholder=" ' +
          values[window.selectedControl]["value"] +
          ' Ω" min="1" max="100"  id="value-' +
          window.selectedControl +
          '" /> </div><div style="display: flex; justify-content: end; padding-right: 18px"><button type="submit"  class="set-value-btn" style="border-radius: 20px">Set Value</button></div></form></div>'
      )
        .appendTo("body")
        .css({ top: event.pageY + "px", left: event.pageX + 10 + "px" });
    } else {
      $(
        '<div class="custom-menu"><div class="name-element"><div class="name-element"><div style="display: flex; justify-content: end; position: relative;top: -4px;height: 28px;margin-bottom: 2px;"><button class="submit fa fa-times cross-btn" id="submit-' +
          window.selectedControl +
          '"></button></div></div></div><form action="#" onsubmit="dcSubmited(' +
          "'" +
          window.selectedControl +
          "'" +
          ')"><div><label for="name-' +
          window.selectedControl +
          '">Name:</label><input type="text" class="set-input-name" id="name-' +
          window.selectedControl +
          '" style="border-radius: 20px; padding:2px;width: 122px;" maxlength="4"  placeholder="  ' +
          values[window.selectedControl]["name"] +
          '" onchange="changeName(' +
          "'" +
          window.selectedControl +
          "'" +
          ',this.value)"/></div><div    class="value-element" style="display: flex; align-items: center; "><label for="value-' +
          window.selectedControl +
          '">Resistance:</label><input type="number" class="set-input" placeholder="  ' +
          values[window.selectedControl]["value"] +
          ' Ω" min="1" max="100"  disabled id="value-' +
          window.selectedControl +
          '" /> </div><div style="display: flex; justify-content: end; padding-right: 18px"><button type="submit"  class="set-value-btn" style="border-radius: 20px">Set Name</button></div></form></div>'
      )
        .appendTo("body")
        .css({ top: event.pageY + "px", left: event.pageX + 10 + "px" });
    }

    //context menu for capacitor

    $(".submit").bind("click", function (event) {
      $("div.custom-menu").remove();
    });
  });

  $("body").on("contextmenu", "#diagram .gatepluse", function (event) {
    event.preventDefault();
    $("div.custom-menu").remove();
    window.selectedControl = $(this).attr("id");

    if (combination_flag) {
      $(
        '<div class="custom-menu" style="width: 193px;"><div class="name-element"><div class="name-element"><div style="display: flex; justify-content: end; position: relative;top: -4px;height: 28px;margin-bottom: 2px;"><button class="submit fa fa-times cross-btn" id="submit-' +
          window.selectedControl +
          '"></button></div></div></div><form action="#" onsubmit="acSubmited(' +
          "'" +
          window.selectedControl +
          "'" +
          ')"><div><label style="color:white;" for="name-' +
          window.selectedControl +
          '">Name:</label><input type="text" class="set-input-name" id="name-' +
          window.selectedControl +
          '" style="border-radius: 20px; padding:2px;width: 140px;" maxlength="7"  placeholder="  ' +
          values[window.selectedControl]["name"] +
          '" onchange="changeName(' +
          "'" +
          window.selectedControl +
          "'" +
          ',this.value)"/></div><div    class="value-element" style="display: flex; align-items: center; "><label for="value-freq-' +
          window.selectedControl +
          '">Frequency:</label><input type="number" class="set-input" min="5" max="100" style="width: 99px;" placeholder="  ' +
          values["freq"] +
          values["unit"] +
          '"id="value-freq-' +
          window.selectedControl +
          '" /> </div><div    class="value-element" style="display: flex; align-items: center; "><label for="value-volt-' +
          window.selectedControl +
          '">Starting&nbsp;Angle:</label><input type="number" min="0" max="999" class="set-input" style="width: 74px;" placeholder="  ' +
          values[window.selectedControl]["fire1"] +
          values[window.selectedControl]["unit"] +
          '" id="value-fire1-' +
          window.selectedControl +
          '" /> </div><div class="value-element" style="display: flex; align-items: center; "><label for="value-freq-' +
          window.selectedControl +
          '">Ending&nbsp;Angle:</label><input type="number" min="0" max="999" class="set-input" placeholder="  ' +
          values[window.selectedControl]["fire2"] +
          values[window.selectedControl]["unit"] +
          '"  id="value-fire2-' +
          window.selectedControl +
          '" /> </div><div style="display: flex; justify-content: end; padding-right: 13px"><button type="submit"  class="set-value-btn" style="border-radius: 20px">Set Value</button></div></form></div>'
      )
        .appendTo("body")
        .css({ top: event.pageY + "px", left: event.pageX + 10 + "px" });
    } else {
      $(
        '<div class="custom-menu" style="width: 193px;"><div class="name-element"><div class="name-element"><div style="display: flex; justify-content: end; position: relative;top: -4px;height: 28px;margin-bottom: 2px;"><button class="submit fa fa-times cross-btn" id="submit-' +
          window.selectedControl +
          '"></button></div></div></div><form action="#"><div><label for="name-' +
          window.selectedControl +
          '">Name:</label><input type="text" class="set-input-name" id="name-' +
          window.selectedControl +
          '" style="border-radius: 20px; padding:2px;width: 140px;" maxlength="7" placeholder="  ' +
          values[window.selectedControl]["name"] +
          '" onchange="changeName(' +
          "'" +
          window.selectedControl +
          "'" +
          ',this.value)"/></div><div    class="value-element" style="display: flex; align-items: center; "><label for="value-freq-' +
          window.selectedControl +
          '">Frequency:</label><input type="number" disabled class="set-input" style="width: 99px;" placeholder="  ' +
          values["freq"] +
          values["unit"] +
          '"id="value-freq-' +
          window.selectedControl +
          '" /> </div><div    class="value-element" style="display: flex; align-items: center; "><label for="value-volt-' +
          window.selectedControl +
          '">Starting&nbsp;Angle:</label><input type="number" class="set-input" style="width: 74px;" placeholder="  ' +
          values[window.selectedControl]["fire1"] +
          values[window.selectedControl]["unit"] +
          '" min="1" max="100" disabled id="value-fire1-' +
          window.selectedControl +
          '" /> </div><div class="value-element" style="display: flex; align-items: center; "><label for="value-freq-' +
          window.selectedControl +
          '">Ending&nbsp;Angle:</label><input type="number" class="set-input" placeholder="  ' +
          values[window.selectedControl]["fire2"] +
          values[window.selectedControl]["unit"] +
          '" min="100" max="900" disabled id="value-fire2-' +
          window.selectedControl +
          '" /> </div><div style="display: flex; justify-content: end; padding-right: 13px"><button type="submit"  class="submit set-value-btn" style="border-radius: 20px">Set Name</button></div></form></div>'
      )
        .appendTo("body")
        .css({ top: event.pageY + "px", left: event.pageX + 10 + "px" });
    }
    $(".submit").bind("click", function (event) {
      $("div.custom-menu").remove();
    });
  });

  $("body").on("contextmenu", "#diagram .gatepluse1", function (event) {
    event.preventDefault();
    $("div.custom-menu").remove();
    window.selectedControl = $(this).attr("id");

    if (correct_connections_flag) {
      $(
        '<div class="custom-menu" style="width: 193px;"><div class="name-element"><div class="name-element"><div style="display: flex; justify-content: end; position: relative;top: -4px;height: 28px;margin-bottom: 2px;"><button class="submit fa fa-times cross-btn" id="submit-' +
          window.selectedControl +
          '"></button></div></div></div><form action="#" onsubmit="firstGateSubmitted(' +
          "'" +
          window.selectedControl +
          "'" +
          ')"><div><label style="color:white;" for="name-' +
          window.selectedControl +
          '">Name:</label><input type="text" class="set-input-name" id="name-' +
          window.selectedControl +
          '" style="border-radius: 20px; padding:2px;width: 140px;" maxlength="7" placeholder="  ' +
          values[window.selectedControl]["name"] +
          '" onchange="changeName(' +
          "'" +
          window.selectedControl +
          "'" +
          ',this.value)"/></div><div    class="value-element" style="display: flex; align-items: center; "><label for="value-freq-' +
          window.selectedControl +
          '">Frequency:</label><input type="number" class="set-input" min="5" max="100" style="width: 99px;" placeholder="  ' +
          values["freq"] +
          values["unit"] +
          '"id="value-freq-' +
          window.selectedControl +
          '" /> </div><div    class="value-element" style="display: flex; align-items: center; "><label for="value-fire1-' +
          window.selectedControl +
          '">Starting&nbsp;Angle:</label><input type="number" min="0" max="999" class="set-input" style="width: 74px;" placeholder="  ' +
          values[window.selectedControl]["fire1"] +
          values[window.selectedControl]["unit"] +
          '" id="value-fire1-' +
          window.selectedControl +
          '" /> </div><div class="value-element" style="display: flex; align-items: center; "><label for="value-fire2-' +
          window.selectedControl +
          '">Ending&nbsp;Angle:</label><input type="number" min="0" max="999" class="set-input" placeholder="  ' +
          values[window.selectedControl]["fire2"] +
          values[window.selectedControl]["unit"] +
          '" id="value-fire2-' +
          window.selectedControl +
          '" /> </div><div style="display: flex; justify-content: end; padding-right: 13px"><button type="submit"  class="set-value-btn" style="border-radius: 20px">Set Value</button></div></form></div>'
      )
        .appendTo("body")
        .css({ top: event.pageY + "px", left: event.pageX + 10 + "px" });
    } else {
      $(
        '<div class="custom-menu" style="width: 193px;"><div class="name-element"><div class="name-element"><div style="display: flex; justify-content: end; position: relative;top: -4px;height: 28px;margin-bottom: 2px;"><button class="submit fa fa-times cross-btn" id="submit-' +
          window.selectedControl +
          '"></button></div></div></div><form action="#" ><div><label for="name-' +
          window.selectedControl +
          '">Name:</label><input type="text" class="set-input-name" id="name-' +
          window.selectedControl +
          '" style="border-radius: 20px; padding:2px;width: 140px;" maxlength="7"  placeholder="  ' +
          values[window.selectedControl]["name"] +
          '" onchange="changeName(' +
          "'" +
          window.selectedControl +
          "'" +
          ',this.value)"/><div    class="value-element" style="display: flex; align-items: center; "><label for="value-freq-' +
          window.selectedControl +
          '">Frequency:</label><input type="number" disabled class="set-input" style="width: 99px;" placeholder="  ' +
          values["freq"] +
          values["unit"] +
          '"id="value-freq-' +
          window.selectedControl +
          '" /> </div></div><div    class="value-element" style="display: flex; align-items: center; "><label for="value-volt-' +
          window.selectedControl +
          '">Starting&nbsp;Angle:</label><input type="number" class="set-input" style="width: 74px;" placeholder="  ' +
          values[window.selectedControl]["fire1"] +
          values[window.selectedControl]["unit"] +
          '" min="1" max="100" disabled id="value-fire1-' +
          window.selectedControl +
          '" /> </div><div class="value-element" style="display: flex; align-items: center; "><label for="value-freq-' +
          window.selectedControl +
          '">Ending&nbsp;Angle:</label><input type="number" class="set-input" placeholder="  ' +
          values[window.selectedControl]["fire2"] +
          values[window.selectedControl]["unit"] +
          '" min="100" max="900" disabled id="value-fire2-' +
          window.selectedControl +
          '" /> </div><div style="display: flex; justify-content: end; padding-right: 13px"><button type="submit"  class="submit set-value-btn" style="border-radius: 20px">Set Name</button></div></form></div>'
      )
        .appendTo("body")
        .css({ top: event.pageY + "px", left: event.pageX + 10 + "px" });
    }
    $(".submit").bind("click", function (event) {
      $("div.custom-menu").remove();
    });
  });
  //dc source
  $("body").on("contextmenu", "#diagram .dcsource", function (event) {
    event.preventDefault();
    $("div.custom-menu").remove();
    window.selectedControl = $(this).attr("id");
    if (correct_connections_flag) {
      $(
        '<div class="custom-menu"><div class="name-element"><div class="name-element"><div style="display: flex; justify-content: end; position: relative;top: -4px;height: 28px;margin-bottom: 2px;"><button class="submit fa fa-times cross-btn" id="submit-' +
          window.selectedControl +
          '"></button></div></div></div><form action="javascript:void(0);" onsubmit="dcSubmited(' +
          "'" +
          window.selectedControl +
          "'" +
          ')"><div><label for="name-' +
          window.selectedControl +
          '">Name:</label><input type="text" class="set-input-name" id="name-' +
          window.selectedControl +
          '" style="border-radius: 20px;  padding:2px;width: 125px;" maxlength="5"  placeholder="   ' +
          values[window.selectedControl]["name"] +
          '" onchange="changeName(' +
          "'" +
          window.selectedControl +
          "'" +
          ',this.value)"/></div><div    class="value-element" style="display: flex; align-items: center; "><label for="value-' +
          window.selectedControl +
          '">Voltage:</label><input type="number" class="set-input" style="width: 104px;" placeholder="  ' +
          values[window.selectedControl]["value"] +
          ' Volt" min="1" max="300"  id="value-' +
          window.selectedControl +
          '" /> </div><div style="display: flex; justify-content: end; padding-right: 13px"><button type="submit" class="set-value-btn" style="border-radius: 20px">Set Value</button></div></form></div>'
      )
        .appendTo("body")
        .css({ top: event.pageY + "px", left: event.pageX + 10 + "px" });
    } else {
      $(
        '<div class="custom-menu"><div class="name-element"><div class="name-element"><div style="display: flex; justify-content: end; position: relative;top: -4px;height: 28px;margin-bottom: 2px;"><button class="submit fa fa-times cross-btn" id="submit-' +
          window.selectedControl +
          '"></button></div></div></div><form action="javascript:void(0);" onsubmit="dcSubmited(' +
          "'" +
          window.selectedControl +
          "'" +
          ')"><div><label for="name-' +
          window.selectedControl +
          '">Name:</label><input type="text" class="set-input-name" id="name-' +
          window.selectedControl +
          '" style="border-radius: 20px; padding:2px;width: 125px;" maxlength="5"  placeholder="   ' +
          values[window.selectedControl]["name"] +
          '" onchange="changeName(' +
          "'" +
          window.selectedControl +
          "'" +
          ',this.value)"/></div><div    class="value-element" style="display: flex; align-items: center; "><label for="value-' +
          window.selectedControl +
          '">Voltage:</label><input type="number" placeholder="  ' +
          values[window.selectedControl]["value"] +
          ' Volt" min="1" max="300" disabled style="width: 104px;" class="set-input" id="value-' +
          window.selectedControl +
          '" /> </div><div style="display: flex; justify-content: end; padding-right: 13px"><button type="submit"  class="set-value-btn" style="border-radius: 20px">Set Name</button></div></form></div>'
      )
        .appendTo("body")
        .css({ top: event.pageY + "px", left: event.pageX + 10 + "px" });
    }

    $(".submit").bind("click", function (event) {
      $("div.custom-menu").remove();
    });
  });
  $("body").on("contextmenu", "#diagram .dc_source_vge", function (event) {
    event.preventDefault();
    $("div.custom-menu").remove();
    window.selectedControl = $(this).attr("id");

    if (new_reading_vge) {
      $(
        '<div class="custom-menu"><div class="name-element"><div class="name-element"><div style="display: flex; justify-content: end; position: relative;top: -4px;height: 28px; margin-bottom:2px; ;"><button class="submit fa fa-times cross-btn" id="submit-' +
          window.selectedControl +
          '"></button></div></div></div><form action="javascript:void(0);" onsubmit="dc_source_submitted_vge(' +
          "'" +
          window.selectedControl +
          "'" +
          ')"><div><label for="name-' +
          window.selectedControl +
          '">Name:</label><input type="text" maxlength="3" class="set-input-name" id="name-' +
          window.selectedControl +
          '" style="border-radius: 20px; padding:2px;width: 125px;"  placeholder="  ' +
          values[window.selectedControl]["name"] +
          '" onchange="changeName(' +
          "'" +
          window.selectedControl +
          "'" +
          ',this.value)"/></div><div    class="value-element" style="display: flex; align-items: center; "><label for="value-' +
          window.selectedControl +
          '">Voltage:</label><select class="set-input" style="    margin-left: 3px;border-radius: 20px;padding: 7px;width: 117px;border: 2px solid;" id="value-' +
          window.selectedControl +
          '"><option value="0" ' +
          dc_defult["d0"] +
          " " +
          dc_defult_enabled["d0"] +
          " hidden>0 V</option><option " +
          dc_defult["d55"] +
          " " +
          dc_defult_enabled["d55"] +
          ' value="5.5">5.5 V</option><option ' +
          dc_defult["d57"] +
          " " +
          dc_defult_enabled["d57"] +
          ' value="5.7">5.7 V</option><option ' +
          dc_defult["d60"] +
          " " +
          dc_defult_enabled["d60"] +
          ' value="6">6 V</option></select>  ' +
          '</div><div style="display: flex; justify-content: end; padding-right: 13px"><button type="submit"  class="set-value-btn" style="border-radius: 20px">Set Value</button></div></form></div>'
      )
        .appendTo("body")
        .css({ top: event.pageY + "px", left: event.pageX + 10 + "px" });
    } else {
      $(
        '<div class="custom-menu"><div class="name-element"><div class="name-element"><div style="display: flex; justify-content: end; position: relative;top: -4px;height: 28px; margin-bottom:2px ;"><button class="submit fa fa-times cross-btn" id="submit-' +
          window.selectedControl +
          '"></button></div></div></div><form action="javascript:void(0);" onsubmit="dcSubmited(' +
          "'" +
          window.selectedControl +
          "'" +
          ')"><div><label for="name-' +
          window.selectedControl +
          '">Name:</label><input type="text" maxlength="3" class="set-input-name" id="name-' +
          window.selectedControl +
          '" style="border-radius: 20px; padding:2px;width: 125px;"  placeholder="  ' +
          values[window.selectedControl]["name"] +
          '" onchange="changeName(' +
          "'" +
          window.selectedControl +
          "'" +
          ',this.value)"/></div><div    class="value-element" style="    margin-left: 3px;display: flex; align-items: center; "><label for="value-' +
          window.selectedControl +
          '">Voltage:</label><select disabled class="set-input" style="    margin-left: 3px;border-radius: 20px;padding: 7px;width: 117px;border: 2px solid;" id="value-' +
          window.selectedControl +
          '"><option value="0" ' +
          dc_defult["d0"] +
          " disabled hidden>0 V</option><option " +
          dc_defult["d55"] +
          ' value="5.5">5.5 V</option><option ' +
          dc_defult["d57"] +
          ' value="5.7">5.7 V</option><option ' +
          dc_defult["d60"] +
          ' value="6">6 V</option></select>  ' +
          '</div><div style="display: flex; justify-content: end; padding-right: 13px"><button type="submit"  class="set-value-btn" style="border-radius: 20px">Set Name</button></div></form></div>'
      )
        .appendTo("body")
        .css({ top: event.pageY + "px", left: event.pageX + 10 + "px" });
    }

    //context menu for capacitor

    $(".submit").bind("click", function (event) {
      $("div.custom-menu").remove();
    });
  });
  $("body").on("contextmenu", "#diagram .dc_source_vce", function (event) {
    event.preventDefault();
    $("div.custom-menu").remove();
    window.selectedControl = $(this).attr("id");

    if (new_reading_vce) {
      $(
        '<div class="custom-menu"><div class="name-element"><div class="name-element"><div style="display: flex; justify-content: end; position: relative;top: -4px;height: 28px; margin-bottom:2px; ;"><button class="submit fa fa-times cross-btn" id="submit-' +
          window.selectedControl +
          '"></button></div></div></div><form action="javascript:void(0);" onsubmit="dc_source_submitted_vce(' +
          "'" +
          window.selectedControl +
          "'" +
          ')"><div><label for="name-' +
          window.selectedControl +
          '">Name:</label><input type="text" maxlength="3" class="set-input-name" id="name-' +
          window.selectedControl +
          '" style="border-radius: 20px; padding:2px;width: 125px;"  placeholder="  ' +
          values[window.selectedControl]["name"] +
          '" onchange="changeName(' +
          "'" +
          window.selectedControl +
          "'" +
          ',this.value)"/></div><div    class="value-element" style="display: flex; align-items: center; "><label for="value-' +
          window.selectedControl +
          '">Voltage:</label><select class="set-input" style="    margin-left: 3px;border-radius: 20px;padding: 7px;width: 117px;border: 2px solid;" id="value-' +
          window.selectedControl +
          '"><option value="0" ' +
          dc_vcc_selected["d0"] +
          " " +
          dc_vcc_enabled["d0"] +
          " hidden>0 V</option><option " +
          dc_vcc_selected["d1"] +
          " " +
          dc_vcc_enabled["d1"] +
          ' value="1">1 V</option><option ' +
          dc_vcc_selected["d2"] +
          " " +
          dc_vcc_enabled["d2"] +
          ' value="2">2 V</option><option ' +
          dc_vcc_selected["d3"] +
          " " +
          dc_vcc_enabled["d3"] +
          ' value="3">3 V</option><option ' +
          dc_vcc_selected["d4"] +
          " " +
          dc_vcc_enabled["d4"] +
          ' value="4">4 V</option><option ' +
          dc_vcc_selected["d5"] +
          " " +
          dc_vcc_enabled["d5"] +
          ' value="5">5 V</option><option ' +
          dc_vcc_selected["d6"] +
          " " +
          dc_vcc_enabled["d6"] +
          ' value="6">6 V</option><option ' +
          dc_vcc_selected["d7"] +
          " " +
          dc_vcc_enabled["d7"] +
          ' value="7">7 V</option></select>  ' +
          '</div><div style="display: flex; justify-content: end; padding-right: 13px"><button type="submit"  class="set-value-btn" style="border-radius: 20px">Set Value</button></div></form></div>'
      )
        .appendTo("body")
        .css({ top: event.pageY + "px", left: event.pageX + 10 + "px" });
    } else {
      $(
        '<div class="custom-menu"><div class="name-element"><div class="name-element"><div style="display: flex; justify-content: end; position: relative;top: -4px;height: 28px; margin-bottom:2px ;"><button class="submit fa fa-times cross-btn" id="submit-' +
          window.selectedControl +
          '"></button></div></div></div><form action="javascript:void(0);" onsubmit="dcSubmited(' +
          "'" +
          window.selectedControl +
          "'" +
          ')"><div><label for="name-' +
          window.selectedControl +
          '">Name:</label><input type="text" maxlength="3" class="set-input-name" id="name-' +
          window.selectedControl +
          '" style="border-radius: 20px; padding:2px;width: 125px;"  placeholder="  ' +
          values[window.selectedControl]["name"] +
          '" onchange="changeName(' +
          "'" +
          window.selectedControl +
          "'" +
          ',this.value)"/></div><div    class="value-element" style="    margin-left: 3px;display: flex; align-items: center; "><label for="value-' +
          window.selectedControl +
          '">Voltage:</label><select disabled class="set-input" style="    margin-left: 3px;border-radius: 20px;padding: 7px;width: 117px;border: 2px solid;" id="value-' +
          window.selectedControl +
          '"><option value="0" ' +
          dc_vcc_selected["d0"] +
          " " +
          dc_vcc_enabled["d0"] +
          " hidden>0 V</option><option " +
          dc_vcc_selected["d1"] +
          " " +
          dc_vcc_enabled["d1"] +
          ' value="1">1 Volt</option><option ' +
          dc_vcc_selected["d2"] +
          " " +
          dc_vcc_enabled["d2"] +
          ' value="2">2 Volt</option><option ' +
          dc_vcc_selected["d3"] +
          " " +
          dc_vcc_enabled["d3"] +
          ' value="3">3 Volt</option><option ' +
          dc_vcc_selected["d4"] +
          " " +
          dc_vcc_enabled["d4"] +
          ' value="4">4 Volt</option><option ' +
          dc_vcc_selected["d5"] +
          " " +
          dc_vcc_enabled["d5"] +
          ' value="5">5 Volt</option><option ' +
          dc_vcc_selected["d6"] +
          " " +
          dc_vcc_enabled["d6"] +
          ' value="6">6 Volt</option><option ' +
          dc_vcc_selected["d7"] +
          " " +
          dc_vcc_enabled["d7"] +
          ' value="7">7 Volt</option></select>  ' +
          '</div><div style="display: flex; justify-content: end; padding-right: 13px"><button type="submit"  class="set-value-btn" style="border-radius: 20px">Set Name</button></div></form></div>'
      )
        .appendTo("body")
        .css({ top: event.pageY + "px", left: event.pageX + 10 + "px" });
    }

    //context menu for capacitor

    $(".submit").bind("click", function (event) {
      $("div.custom-menu").remove();
    });
  });
  $("body").on("contextmenu", "#diagram .other", function (event) {
    event.preventDefault();
    $("div.custom-menu").remove();
    window.selectedControl = $(this).attr("id");

    $(
      '<div class="custom-menu"><div class="name-element"><div style="display: flex; justify-content: end;position: relative;top: -4px;height: 28px;margin-bottom: 2px;"><button class="submit fa fa-times cross-btn"></button></div><label for="name-' +
        window.selectedControl +
        '">Name:</label><input type="text"  id="name-' +
        window.selectedControl +
        '" class="set-input-name" style="width: 125px;" maxlength="6" placeholder="   ' +
        values[window.selectedControl]["name"] +
        '" onchange="changeName(' +
        "'" +
        window.selectedControl +
        "'" +
        ',this.value)"/><div style="display: flex; justify-content: end; padding-right: 13px;"><div><button class="submit set-value-btn" style="border-radius: 20px">Set Name</button></div></div>'
    )
      .appendTo("body")
      .css({ top: event.pageY + "px", left: event.pageX + 10 + "px" });
    $(".submit").bind("click", function (event) {
      $("div.custom-menu").remove();
    });
  });
  $("body").on("contextmenu", "#diagram .curr", function (event) {
    event.preventDefault();
    $("div.custom-menu").remove();
    window.selectedControl = $(this).attr("id");

    $(
      '<div class="custom-menu"><div class="name-element"><div style="display: flex; justify-content: end;position: relative;top: -4px;height: 28px;margin-bottom: 2px;"><button class="submit fa fa-times cross-btn"></button></div><label for="name-' +
        window.selectedControl +
        '">Name:</label><input type="text"  id="name-' +
        window.selectedControl +
        '" class="set-input-name" style="width: 125px;" maxlength="7" placeholder="   ' +
        values[window.selectedControl]["name"] +
        '" onchange="changeName(' +
        "'" +
        window.selectedControl +
        "'" +
        ',this.value)"/><div style="display: flex; justify-content: end; padding-right: 13px;"><div><button class="submit set-value-btn" style="border-radius: 20px">Set Name</button></div></div>'
    )
      .appendTo("body")
      .css({ top: event.pageY + "px", left: event.pageX + 10 + "px" });
    $(".submit").bind("click", function (event) {
      $("div.custom-menu").remove();
    });
  });
  $("body").on("contextmenu", "#diagram .RESISTOR2", function (event) {
    event.preventDefault();
    $("div.custom-menu").remove();
    window.selectedControl = $(this).attr("id");

    $(
      '<div class="custom-menu"><div class="name-element"><div style="display: flex; justify-content: end;position: relative;top: -4px;height: 28px;margin-bottom: 2px;"><button class="submit fa fa-times cross-btn"></button></div><label for="name-' +
        window.selectedControl +
        '">Name:</label><input type="text"  id="name-' +
        window.selectedControl +
        '" class="set-input-name" style="width: 125px;" maxlength="13" placeholder="   ' +
        values[window.selectedControl]["name"] +
        '" onchange="changeName(' +
        "'" +
        window.selectedControl +
        "'" +
        ',this.value)"/><div style="display: flex; justify-content: end; padding-right: 13px;"><div><button class="submit set-value-btn" style="border-radius: 20px">Set Name</button></div></div>'
    )
      .appendTo("body")
      .css({ top: event.pageY + "px", left: event.pageX + 10 + "px" });
    $(".submit").bind("click", function (event) {
      $("div.custom-menu").remove();
    });
  });
  $("body").on("contextmenu", "#diagram .RESISTOR1", function (event) {
    event.preventDefault();
    $("div.custom-menu").remove();
    window.selectedControl = $(this).attr("id");

    $(
      '<div class="custom-menu"><div class="name-element"><div style="display: flex; justify-content: end;position: relative;top: -4px;height: 28px;margin-bottom: 2px;"><button class="submit fa fa-times cross-btn"></button></div><label for="name-' +
        window.selectedControl +
        '">Name:</label><input type="text"  id="name-' +
        window.selectedControl +
        '" class="set-input-name" style="width: 125px;" maxlength="8" placeholder="   ' +
        values[window.selectedControl]["name"] +
        '" onchange="changeName(' +
        "'" +
        window.selectedControl +
        "'" +
        ',this.value)"/><div style="display: flex; justify-content: end; padding-right: 13px;"><div><button class="submit set-value-btn" style="border-radius: 20px">Set Name</button></div></div>'
    )
      .appendTo("body")
      .css({ top: event.pageY + "px", left: event.pageX + 10 + "px" });
    $(".submit").bind("click", function (event) {
      $("div.custom-menu").remove();
    });
  });
  $("body").on("contextmenu", "#diagram .vload", function (event) {
    event.preventDefault();
    $("div.custom-menu").remove();
    window.selectedControl = $(this).attr("id");

    $(
      '<div class="custom-menu"><div class="name-element"><div style="display: flex; justify-content: end;position: relative;top: -4px;height: 28px;margin-bottom: 2px;"><button class="submit fa fa-times cross-btn"></button></div><label for="name-' +
        window.selectedControl +
        '">Name:</label><input type="text"  id="name-' +
        window.selectedControl +
        '" class="set-input-name" style="width: 125px;" maxlength="5" placeholder="   ' +
        values[window.selectedControl]["name"] +
        '" onchange="changeName(' +
        "'" +
        window.selectedControl +
        "'" +
        ',this.value)"/><div style="display: flex; justify-content: end; padding-right: 13px;"><div><button class="submit set-value-btn" style="border-radius: 20px">Set Name</button></div></div>'
    )
      .appendTo("body")
      .css({ top: event.pageY + "px", left: event.pageX + 10 + "px" });
    $(".submit").bind("click", function (event) {
      $("div.custom-menu").remove();
    });
  });
  $("body").on("contextmenu", "#diagram .ground1", function (event) {
    event.preventDefault();
    $("div.custom-menu").remove();
    window.selectedControl = $(this).attr("id");

    $(
      '<div class="custom-menu"><div class="name-element"><div style="display: flex; justify-content: end;position: relative;top: -4px;height: 28px;margin-bottom: 2px;"><button class="submit fa fa-times cross-btn"></button></div><label for="name-' +
        window.selectedControl +
        '">Name:</label><input type="text" maxlength="6" id="name-' +
        window.selectedControl +
        '" class="set-input-name" style="width: 125px;" placeholder="   ' +
        values[window.selectedControl]["name"] +
        '" onchange="changeName(' +
        "'" +
        window.selectedControl +
        "'" +
        ',this.value)"/><div style="display: flex; justify-content: end; padding-right: 13px;"><div><button class="submit set-value-btn" style="border-radius: 20px">Set Name</button></div></div>'
    )
      .appendTo("body")
      .css({ top: event.pageY + "px", left: event.pageX + 10 + "px" });
    $(".submit").bind("click", function (event) {
      $("div.custom-menu").remove();
    });
  });
});

function changeName(name, value) {
  values[name]["name"] = value.toUpperCase();
  var ele = name + "-name";
  $("#" + ele).text(values[name]["name"]);
  if (correct_connections_flag) {
    plotData();
  }
}
function changeFrequency() {
  $("#" + "G1-freq").text(values["freq"] + values["unit"]);
  $("#" + "G2-freq").text(values["freq"] + values["unit"]);
  $("#" + "G3-freq").text(values["freq"] + values["unit"]);
  $("#" + "G4-freq").text(values["freq"] + values["unit"]);
  $("#" + "G5-freq").text(values["freq"] + values["unit"]);
  $("#" + "G6-freq").text(values["freq"] + values["unit"]);
}
function makeDefault() {
  $("#" + "G1-value").text("");
  $("#" + "G2-value").text("");
  $("#" + "G3-value").text("");
  $("#" + "G4-value").text("");
  $("#" + "G5-value").text("");
  $("#" + "G6-value").text("");
  values["G1"]["fire1"] = 0;
  values["G2"]["fire1"] = 0;
  values["G2"]["fire2"] = 0;
  values["G3"]["fire1"] = 0;
  values["G3"]["fire2"] = 0;
  values["G4"]["fire1"] = 0;
  values["G4"]["fire2"] = 0;
  values["G5"]["fire1"] = 0;
  values["G5"]["fire2"] = 0;
  values["G6"]["fire1"] = 0;
  values["G6"]["fire2"] = 0;
}
function firstGateSubmitted(name) {
  var freq = parseInt(document.getElementById("value-freq-" + name).value);
  if (!Number.isNaN(freq)) {
    values["freq"] = freq;
    changeFrequency();
  }
  var ele;
  var fire1 = parseInt(document.getElementById("value-fire1-" + name).value);
  var fire2 = parseInt(document.getElementById("value-fire2-" + name).value);
  if (!Number.isNaN(fire1) && !Number.isNaN(fire2)) {
    if (fire1 == 0) {
      if (fire2 == 120) {
        combination_flag = true;
        values[name]["fire2"] = 120;
        combination = 120;
        makeDefault();
        var ele = name + "-value";
        $("#" + ele).text(
          values[name]["fire1"] +
            values[name]["unit"] +
            " " +
            values[name]["fire2"] +
            values[name]["unit"]
        );
      } else if (fire2 == 180) {
        combination_flag = true;
        values[name]["fire2"] = 180;
        combination = 180;
        makeDefault();
        var ele = name + "-value";
        $("#" + ele).text(
          values[name]["fire1"] +
            values[name]["unit"] +
            " " +
            values[name]["fire2"] +
            values[name]["unit"]
        );
      } else {
        openPopup(
          "new-img/404-warning.png",
          "Please follow the Instructions to enter the correct angle",
          "21px"
        );
      }
    } else {
      openPopup(
        "new-img/404-warning.png",
        "Please follow the Instructions to enter the correct angle",
        "21px"
      );
    }
  } else {
    if (!Number.isNaN(fire1)) {
      if (values[name]["fire2"] == 0) {
        openPopup("new-img/404-warning.png", "Ending angle is Empty", "28px");
      } else if (fire1 != 0) {
        openPopup(
          "new-img/404-warning.png",
          "Please follow the Instructions to enter the correct angle",
          "21px"
        );
      } else {
        values[name]["fire1"] = 0;
        var ele = name + "-value";
        $("#" + ele).text(
          values[name]["fire1"] +
            values[name]["unit"] +
            " " +
            values[name]["fire2"] +
            values[name]["unit"]
        );
      }
    }
    if (!Number.isNaN(fire2)) {
      if (fire2 == 120) {
        combination_flag = true;
        values[name]["fire2"] = 120;
        combination = 120;
        new_reading = true;
        makeDefault();

        var ele = name + "-value";
        $("#" + ele).text(
          values[name]["fire1"] +
            values[name]["unit"] +
            " " +
            values[name]["fire2"] +
            values[name]["unit"]
        );
      } else if (fire2 == 180) {
        combination_flag = true;
        values[name]["fire2"] = 180;
        combination = 180;
        new_reading = true;
        makeDefault();
        var ele = name + "-value";
        $("#" + ele).text(
          values[name]["fire1"] +
            values[name]["unit"] +
            " " +
            values[name]["fire2"] +
            values[name]["unit"]
        );
      } else {
        openPopup(
          "new-img/404-warning.png",
          "Please follow the Instructions to enter the correct angle",
          "21px"
        );
      }
    }
  }
  document.getElementById("submit-" + name).click();
  if (correct_connections_flag) {
    plotData();
  }
}
function acSubmited(name) {
  var freq = parseInt(document.getElementById("value-freq-" + name).value);
  if (!Number.isNaN(freq)) {
    values["freq"] = freq;
    changeFrequency();
  }
  var fire1 = parseInt(document.getElementById("value-fire1-" + name).value);
  var fire2 = parseInt(document.getElementById("value-fire2-" + name).value);
  if (!Number.isNaN(fire1) && !Number.isNaN(fire2)) {
    if (combination == 120) {
      if (values120[name]["fire1"] == fire1) {
        if (values120[name]["fire2"] == fire2) {
          values[name]["fire1"] = fire1;
          values[name]["fire2"] = fire2;
          var ele = name + "-value";
          $("#" + ele).text(
            values[name]["fire1"] +
              values[name]["unit"] +
              " " +
              values[name]["fire2"] +
              values[name]["unit"]
          );
        } else {
          openPopup(
            "new-img/404-warning.png",
            "Please follow step 4 to enter the correct angle",
            "21px"
          );
        }
      } else {
        openPopup(
          "new-img/404-warning.png",
          "Please follow step 4 to enter the correct angle",
          "21px"
        );
      }
    } else if (combination == 180) {
      if (values180[name]["fire1"] == fire1) {
        if (values180[name]["fire2"] == fire2) {
          values[name]["fire1"] = fire1;
          values[name]["fire2"] = fire2;

          var ele = name + "-value";
          $("#" + ele).text(
            values[name]["fire1"] +
              values[name]["unit"] +
              " " +
              values[name]["fire2"] +
              values[name]["unit"]
          );
        } else {
          openPopup(
            "new-img/404-warning.png",
            "Please follow step 8 to enter the correct angle",
            "21px"
          );
        }
      } else {
        openPopup(
          "new-img/404-warning.png",
          "Please follow step 8 to enter the correct angle",
          "21px"
        );
      }
    }
  } else {
    if (!Number.isNaN(freq)) {
    } else if (!Number.isNaN(fire1)) {
      openPopup("new-img/404-warning.png", "Ending angle is Empty", "28px");
    } else if (!Number.isNaN(fire2)) {
      openPopup("new-img/404-warning.png", "Starting angle is Empty", "28px");
    }
  }

  document.getElementById("submit-" + name).click();
  if (correct_connections_flag) {
    plotData();
  }
}
function resisSubmited(name) {
  var a = parseInt(document.getElementById("value-" + name).value);
  if (!Number.isNaN(a)) {
    new_reading = true;
    values["R1"]["value"] = a;
    values["R2"]["value"] = a;
    values["R3"]["value"] = a;
    $("#" + "R1-value").text(values[name]["value"] + values[name]["unit"]);
    $("#" + "R2-value").text(values[name]["value"] + values[name]["unit"]);
    $("#" + "R3-value").text(values[name]["value"] + values[name]["unit"]);
  }
  document.getElementById("submit-" + name).click();

  if (correct_connections_flag) {
    plotData();
  }
}
function dcSubmited(name) {
  var a = document.getElementById("value-" + name).value;
  if (a != "0") {
    new_reading = true;
    values[name]["value"] = a;
    var ele = name + "-value";
    $("#" + ele).text(values[name]["value"] + values[name]["unit"]);
  }
  document.getElementById("submit-" + name).click();

  if (correct_connections_flag) {
    plotData();
  }
  return false;
}
function instchange() {
  document.getElementById("inst").classList.toggle("inst-display");
}

$(document).ready(function () {
  $("#data").on("click", function () {
    $("#readings").show();
  });
});
document.getElementById("check1").addEventListener("click", () => {
  if (wrong_connection.length == 0) {
    if (user_connection.length < 12) {
      openPopup(
        "new-img/404-warning.png",
        "Please make all the connections",
        "28px"
      );
    } else {
      openPopup(
        "new-img/404-tick.png",
        "Well Done! All Connections are Connected",
        "23px"
      );

      correct_connections_flag = true;
      new_reading_vge = true;
      $("#R1-value").text("15 Ω");
      $("#R2-value").text("1K Ω");
    }
  } else {
    openPopup(
      "new-img/404-warning.png",
      "Wrong connection present in the circuit",
      "23px"
    );
  }
});

function showreadings() {
  if (correct_connections_flag) {
    if (
      values["DC1"]["value"] != 0 &&
      values["G1"]["fire2"] != 0 &&
      values["G2"]["fire1"] != 0 &&
      values["G2"]["fire2"] != 0 &&
      values["G3"]["fire1"] != 0 &&
      values["G3"]["fire2"] != 0 &&
      values["G4"]["fire1"] != 0 &&
      values["G4"]["fire2"] != 0 &&
      values["G5"]["fire1"] != 0 &&
      values["G5"]["fire2"] != 0 &&
      values["G6"]["fire1"] != 0 &&
      values["G6"]["fire2"] != 0 &&
      values["freq"] != 0 &&
      values["R1"]["value"] != 0
    ) {
      if (combination == 120) {
        if (count_120 < 7) {
          if (new_reading) {
            var a = document.getElementById("tab");
            var b = a.innerHTML;
            var str =
              "<tr><td>" +
              count_120 +
              "</td><td>" +
              values["rms"] +
              "</td><td>" +
              values["line"] +
              "</td><td>" +
              values["R1"]["value"] +
              "</td></tr>";
            a.innerHTML = b + str;
            count_120 = count_120 + 1;
            new_reading = false;
          }
        } else {
          openPopup(
            "new-img/404-warning.png",
            "You can only add 6 readings in the table",
            "23px"
          );
        }
      } else if (combination == 180) {
        if (count_180 < 7) {
          if (new_reading) {
            var a = document.getElementById("tab_180");
            var b = a.innerHTML;
            var str =
              "<tr><td>" +
              count_180 +
              "</td><td>" +
              values["rms"] +
              "</td><td>" +
              values["line"] +
              "</td><td>" +
              values["R1"]["value"] +
              "</td></tr>";
            a.innerHTML = b + str;
            count_180 = count_180 + 1;
            new_reading = false;
          }
        } else {
          openPopup(
            "new-img/404-warning.png",
            "You can only add 6 readings in the table",
            "23px"
          );
        }
      }
    }
  }
}
var previous_readings_vge = [0];
var current_reading_no = 1;
function dc_source_submitted_vge(name) {
  var a = document.getElementById("value-" + name).value;
  var check_flag = true;
  for (i of previous_readings_vge) {
    if (parseFloat(a) == i) {
      check_flag = false;
      break;
    }
  }
  if (check_flag) {
    if (current_reading_no < 4) {
      new_reading = true;
      new_reading_vce = true;

      values[name]["value"] = a;
      previous_readings_vge.push(parseFloat(a));
      var ele = name + "-value";
      new_reading = true;
      $("#" + ele).text(values[name]["value"] + values[name]["unit"]);
      var k = "d" + values["DC2"]["value"] * 10;
      for (i in dc_defult) {
        if (i == k) {
          dc_defult[i] = "selected";
        } else {
          dc_defult[i] = "";
        }
      }
      dc_defult_enabled["d" + (parseFloat(a) * 10).toString()] = "disabled";
      current_reading_no = current_reading_no + 1;
      document.getElementById("display_table").style.display = "block";
      var tab = document.getElementById("tab");
      makeDefault_vce();
      if (first_reading_flag) {
        first_reading_flag = false;
        tab.innerHTML =
          tab.innerHTML +
          `<tr id="row-1-details" >
        <th rowspan="2" >S.No.</th>
        <th >V<sub>GE</sub></th>
        </tr>
        <tr id="row-2-value">
        <th >${a}&nbsp;V</th>
        </tr>
        <tr id="row-3-ic"><th>V<sub>CE</sub> (V)</th>
        <th >I<sub>C</sub>&nbsp;(mA)</th>
        </tr>`;
      } else {
        var r1 = document.getElementById("row-1-details");
        r1.innerHTML = r1.innerHTML + "<th>V<sub>GE</sub></th>";
        r1 = document.getElementById("row-2-value");
        r1.innerHTML = r1.innerHTML + `<th>${a}&nbsp;V</th>`;
        r1 = document.getElementById("row-3-ic");
        r1.innerHTML = r1.innerHTML + `<th>I<sub>C</sub>&nbsp;(mA)</th>`;
      }
      new_reading_vge = false;
    }
  }
  document.getElementById("submit-" + name).click();

  if (correct_connections_flag) {
    plotData();
  }
  return false;
}
var previous_readings = [0];
function makeDefault_vce() {
  previous_readings = [0];
  dc_vcc_selected = {
    d0: "selected",
    d1: "",
    d2: "",
    d3: "",
    d4: "",
    d5: "",
    d6: "",
    d7: "",
  };
  dc_vcc_enabled = {
    d0: "disabled",
    d1: "",
    d2: "disabled",
    d3: "disabled",
    d4: "disabled",
    d5: "disabled",
    d6: "disabled",
    d7: "disabled",
  };
  values["DC1"]["value"] = 0;
  $("#" + "DC1-value").text("");
}
function dc_source_submitted_vce(name) {
  var a = document.getElementById("value-" + name).value;
  if (a != 0) {
    values[name]["value"] = parseInt(a);
    for (i of previous_readings) {
      if (parseInt(a) != i) {
        previous_reading_current = true;
        break;
      }
    }
    var ele = name + "-value";
    $("#" + ele).text(a + values[name]["unit"]);
    var k = "d" + values["DC1"]["value"];
    for (i in dc_vcc_selected) {
      if (i == k) {
        dc_vcc_selected[i] = "selected";
      } else {
        dc_vcc_selected[i] = "";
      }
    }
  }
  document.getElementById("submit-" + name).click();

  if (correct_connections_flag) {
    plotData();
  }
  return false;
}
function check_vce_values() {
  var a = values["DC1"]["value"];
  var check_flag = true;
  for (i of previous_readings) {
    if (parseInt(a) == i) {
      check_flag = false;
      break;
    }
  }
  if (check_flag) {
    previous_readings.push(parseInt(a));
    new_reading = true;
    dc_vcc_enabled["d" + (parseInt(a) + 1)] = " ";
    display_readings();
    previous_reading_current = false;
  } else {
    if (major_count % 7 == 0 && parseInt(a) != 0) {
      if (major_count == 21) {
        openPopup(
          "new-img/404-warning.png",
          "You can add only three sets of readings",
          "23px"
        );
      } else {
        openPopup(
          "new-img/404-warning.png",
          "Select different VGG to add more readings",
          "23px"
        );
      }
    } else {
      if (previous_reading_current) {
        if (parseInt(a) != 0) {
          openPopup(
            "new-img/404-warning.png",
            "This reading is already added in the table",
            "23px"
          );
        }
      }
    }
  }
}
var count = 1;
var major_count = 0;
function display_readings() {
  if (new_reading_table) {
    var tab = document.getElementById("tab");
    tab.innerHTML =
      tab.innerHTML +
      `<tr id="row-${count}-reading-value"><td>${count}</td><td>${
        data["vge" + values["DC2"]["value"] * 10][count]
      }</td></tr>`;
    if (count == 7) {
      new_reading_vge = true;
      new_reading_table = false;
      count = 0;
      plot_data_points.push({
        x: xval,
        y: data["vge" + values["DC2"]["value"] * 10],
        mode: "lines",
        name: `V<sub>GE</sub> = ${values["DC2"]["value"]}V`,
        marker: {
          color: colors.pop(),
        },
      });
      plotData();
      document.getElementById("transfer").style.display = "block";
    }
    count += 1;
    major_count += 1;
  } else {
    if (count < 8) {
      var tab = document.getElementById(`row-${count}-reading-value`);
      tab.innerHTML =
        tab.innerHTML +
        `<td>${data["vge" + values["DC2"]["value"] * 10][count]}</td>`;
      if (count == 7) {
        new_reading_vge = true;
        count = 0;
        plot_data_points.push({
          x: xval,
          y: data["vge" + values["DC2"]["value"] * 10],
          mode: "lines",
          name: `V<sub>GE</sub> = ${values["DC2"]["value"]}V`,
          marker: {
            color: colors.pop(),
          },
        });
        plotData();
      }
      count += 1;
      major_count += 1;
    }
  }
}
