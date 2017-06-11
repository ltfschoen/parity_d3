(function(exports) {
  "use strict";

  function Job() {
    this.barLabels = ["profile"];
    this.barAmountLabels = ["amount"];
    this.unfitableLabels = ["date", "workweek", "from", "to"];
  }
  exports.Job = Job;

  Job.prototype = {
    isBarLabel: function(propertyName, parentName) {
      return (this.barLabels.indexOf(propertyName) != -1 || this.barLabels.indexOf(parentName) != -1);
    },
    isBarAmountLabel: function(propertyName) {
      return this.barAmountLabels.indexOf(propertyName) != -1;
    },
    isUnfitableLabel: function(propertyName, parentName) {
      return (this.unfitableLabels.indexOf(propertyName) != -1 || this.unfitableLabels.indexOf(parentName) != -1);;
    },
    getNewLineForLevel: function(level, data, categoryName) {
      let liLevel = level.append("li")
        .attr("class", "accordion-item " + (categoryName == "headline" ? "is-active" : ""))
        .attr("data-class", "data-accordion-item")

      liLevel.append("a")
        .attr("href", "#" + categoryName)
        .attr("class", "accordion-title")
        .text(function (d) {
          return jobUtils.toHumanisedAll(categoryName);
        })

      return liLevel.selectAll(".div.line")
        .data(data)
        .enter()
        .append("div")
        .attr("data-class", "data-tab-content")
        .attr("class", "line accordion-content")
        .attr("id", categoryName)
    },
    getCategoryForLine: function(line, keyIndex) {
      return line.append("div")
        .attr("class", "category")
        .text(function (d) {
          return jobUtils.toHumanisedFirst(Object.keys(d)[keyIndex]);
        })
    },
    getLabelForCategory: function(category, categoryName) {
      return category.append("div")
        .attr("class", "label")
    },
    getSublabelOfLabelForCategory: function(subcategory, category, categoryName) {
      return subcategory.append("div")
        .attr("class", "sub-label")
    },
    renderLevelsForCategory: function(data, categoryKey, categoryLabel, category, categoryName) {
      let i1 = 0;
      for (let k1 in categoryKey) {
        this.renderSublabelValueForLabel(k1, data, categoryLabel, categoryName, i1);
        if (jobUtils.isObject(categoryKey[k1]) && !jobUtils.isArray(categoryKey[k1])) {
          let i2 = 0;
          for (let k2 in categoryKey[k1]) {
            let sublabel = this.getSublabelOfLabelForCategory(categoryLabel, category, categoryName);
            this.renderSubSublabelValueForLabel(k1, k2, data, sublabel, categoryLabel, categoryName, i1, i2);
            i2++;
          }
        }
        i1++;
      }
    },
    renderValueForCategory: function(category, categoryName) {
      category.append("span")
        .attr("class", "spacer")

      return category.append("div")
        .attr("class", "category-text-value")
        .text(function (d) {
          if (typeof d[categoryName] ===  "string") {
            return jobUtils.toHumanisedFirst(d[categoryName].split(',').join(', '));
          } else if (typeof d[categoryName] ===  "object") {
            return jobUtils.toHumanisedFirst(d[categoryName].join(', '));
          }
        })
    },
    renderSublabelValueForLabel: function(propertyName, data, label, categoryName, keyIndex) {
      let propertyValue = data[0][categoryName][propertyName];

      label.append("span")
        .attr("class", "spacer")
      label.append("span")
        .attr("class", "label-wrapper")
        .text(function (d) {
          return jobUtils.toHumanisedFirst(Object.keys(d[categoryName])[keyIndex]);
        })

      if (jobUtils.isObject(propertyValue) && !jobUtils.isArray(propertyValue)) {
        return
      }
      return this.processRender(this, label, propertyValue, propertyName, categoryName);
    },
    renderSubSublabelValueForLabel: function(propertyName, subPropertyName, data, subLabel, label, categoryName, keyIndex, subKeyIndex) {
      let subPropertyValue = data[0][categoryName][propertyName][subPropertyName];

      subLabel.append("span")
        .attr("class", "spacer")
      subLabel.append("span")
        .attr("class", "sub-label-wrapper")
        .text(function (d) {
          return jobUtils.toHumanisedFirst(Object.keys(d[categoryName][propertyName])[subKeyIndex]);
        })

      return this.processRender(this, subLabel, subPropertyValue, subPropertyName, propertyName);
    },
    processRender: function(that, label, propertyValue, propertyName, parentName) {
      label.append("div")
        .attr("class", function (d) {
          if (typeof propertyValue === "number" && that.isBarLabel(propertyName, parentName)) {
            return "bar";
          } else if (typeof propertyValue === "number" && that.isBarAmountLabel(propertyName)) {
            return "amount-bar"
          } else if (typeof propertyValue === "number") {
            return "label-text-value";
          } else if (typeof propertyValue === "string") {
            return "label-text-value";
          } else if (typeof propertyValue === "object") {
            return "label-text-value";
          } else if (typeof propertyValue === "boolean") {
            return "label-text-value";
          }
        })
        .style("width", function (d) {
          if (typeof propertyValue === "number" && that.isUnfitableLabel(propertyName, parentName)) {
            return "";
          } else if (typeof propertyValue === "number" && that.isBarLabel(propertyName, parentName)) {
            return propertyValue + "px";
          } else {
            return "";
          }

        })
        .text(function (d) {
          if (typeof propertyValue === "number" && propertyName.indexOf("date") == -1) {
            return Math.round(propertyValue);
          } else if (typeof propertyValue === "number" && propertyName.indexOf("date") != -1) {
            return moment(new Date(propertyValue)).calendar();
          } else if (typeof propertyValue === "string") {
            if (propertyValue == "Expert") {
              for (let i = 0; i < 5; i++) {
                label.append("text")
                  .attr("style", "font-family:FontAwesome; color:orange")
                  .attr('font-size', "50px")
                  .attr("x", 440)
                  .attr("y", 440)
                  .text(function (d) {
                    return '\uf005'
                  });
              }
            } else if (propertyValue == "Good") {
              for (let i = 0; i < 3; i++) {
                label.append("text")
                  .attr("style", "font-family:FontAwesome; color:gold")
                  .attr('font-size', "50px")
                  .attr("x", 440)
                  .attr("y", 440)
                  .text(function (d) {
                    return '\uf005'
                  });
              }
              for (let i = 0; i < 2; i++) {
                label.append("text")
                  .attr("style", "font-family:FontAwesome; color:white")
                  .attr('font-size', "50px")
                  .attr("x", 440)
                  .attr("y", 440)
                  .text(function (d) {
                    return '\uf006'
                  });
              }
            } else if (propertyValue == "Familiar") {
              for (let i = 0; i < 2; i++) {
                label.append("text")
                  .attr("style", "font-family:FontAwesome; color:orange")
                  .attr('font-size', "50px")
                  .attr("x", 440)
                  .attr("y", 440)
                  .text(function (d) {
                    return '\uf005'
                  });
              }
              for (let i = 0; i < 1; i++) {
                label.append("text")
                  .attr("style", "font-family:FontAwesome; color:gold")
                  .attr('font-size', "50px")
                  .attr("x", 440)
                  .attr("y", 440)
                  .text(function (d) {
                    return '\uf123'
                  });
              }
              for (let i = 0; i < 2; i++) {
                label.append("text")
                  .attr("style", "font-family:FontAwesome; color:white")
                  .attr('font-size', "50px")
                  .attr("x", 440)
                  .attr("y", 440)
                  .text(function (d) {
                    return '\uf006'
                  });
              }
            } else {
              return jobUtils.toHumanisedFirst(propertyValue.split(',').join(', '));
            }
          } else if (typeof propertyValue === "object") {
            return jobUtils.toHumanisedAll(propertyValue.join(', '));
          } else if (typeof propertyValue === "boolean") {
            if (propertyValue == true) {
              label.append("text")
                .attr("style", "font-family:FontAwesome; color:green")
                .attr('font-size', "50px")
                .attr("x", 440)
                .attr("y", 440)
                .text(function (d) {
                  return '\uf00c'
                });
            } else {
              label.append("text")
                .attr("style", "font-family:FontAwesome; color:red")
                .attr('font-size', "50px")
                .attr("x", 440)
                .attr("y", 440)
                .text(function (d) {
                  return '\uf00d'
                });
            }
          }
        })
    },
    draw: function(data) {
      // let chart = d3.select("body")
      //   .append("div")
      //   .attr("class", "chart")
      let accordion = d3.select("ul")

      let i = 0;
      for (let categoryKey in data[0]) {
        let categoryName = categoryKey; // category._groups[0][0].innerText.toLowerCase();
        let line = this.getNewLineForLevel(accordion, data, categoryName);
        let category = this.getCategoryForLine(line, i);
        let key = data[0][categoryName];
        if (jobUtils.isObject(key) && !jobUtils.isArray(key)) {
          let label = this.getLabelForCategory(category, categoryName);
          this.renderLevelsForCategory(data, key, label, category, categoryName);
        } else {
          this.renderValueForCategory(category, categoryName);
        }
        i++
      }
    }
  }

  exports.jobClass = {
    Job: Job
  }

})(this);