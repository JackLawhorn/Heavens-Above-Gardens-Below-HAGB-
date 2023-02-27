/*
THIS IS A GENERATED/BUNDLED FILE BY ESBUILD
if you want to view the source, please visit the github repository of this plugin
*/

var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/main.ts
__export(exports, {
  default: () => HeadingIndent
});
var import_obsidian2 = __toModule(require("obsidian"));

// src/preview_indenting.ts
var containerSelector = ".workspace-leaf.mod-active .markdown-reading-view .markdown-preview-section";
var arrClassesHeadings = {
  1: "heading_h1",
  2: "heading_h2",
  3: "heading_h3",
  4: "heading_h4",
  5: "heading_h5",
  6: "heading_h6"
};
var arrClassesData = {
  0: "data_no-heading",
  1: "data_h1",
  2: "data_h2",
  3: "data_h3",
  4: "data_h4",
  5: "data_h5",
  6: "data_h6"
};
function setObserverToActiveLeaf(plugin) {
  if (plugin.previewObserver !== void 0) {
    plugin.previewObserver.disconnect();
  }
  const targetNode = activeDocument.querySelector(containerSelector);
  if (targetNode == null) {
    console.log("target node is NULL");
    return;
  }
  const config = { childList: true };
  const callback = (mutationList, observer) => {
    for (const mutation of mutationList) {
      if (mutation.type === "childList") {
        wrapperIndentPreview(plugin, 100, true);
      }
    }
  };
  plugin.previewObserver = new MutationObserver(callback);
  plugin.previewObserver.observe(targetNode, config);
}
function wrapperIndentPreview(plugin, timeout, flag) {
  timeout = timeout || 100;
  if (flag) {
    if (plugin.flagExecute == void 0)
      plugin.flagExecute = 1;
    if (plugin.flagExecute == 1) {
      plugin.flagExecute = 2;
      setTimeout(function() {
        return __async(this, null, function* () {
          indentPreview(plugin);
        });
      }, timeout);
      setTimeout(() => {
        plugin.flagExecute = 1;
      }, timeout + 50);
    }
  } else {
    setTimeout(function() {
      return __async(this, null, function* () {
        indentPreview(plugin);
      });
    }, timeout);
  }
}
function indentPreview(plugin) {
  const settings = plugin.settings;
  const divsNodeList = activeDocument.querySelectorAll(containerSelector + " > div");
  if (!divsNodeList) {
    return;
  }
  const arrDivs = Array.from(divsNodeList);
  const excludedClassNames = ["mod-header", "mod-footer", "markdown-preview-pusher"];
  cleanSectionModifications(arrDivs);
  const arrMargins = {
    0: 0,
    1: parseInt(settings.h1) || 0,
    2: parseInt(settings.h2) || 0,
    3: parseInt(settings.h3) || 0,
    4: parseInt(settings.h4) || 0,
    5: parseInt(settings.h5) || 0,
    6: parseInt(settings.h6) || 0
  };
  let hNumber = 0;
  suck:
    for (const div of arrDivs) {
      if (excludedClassNames.some((className) => div.classList.contains(className))) {
        continue suck;
      }
      let headingNodeList = div.querySelectorAll("h1, h2, h3, h4, h5, h6"), currentDivIsHeading = headingNodeList.length > 0;
      if (currentDivIsHeading) {
        let hTag = headingNodeList[0].tagName.toLowerCase();
        hNumber = parseInt(hTag.replace(/^\D+/g, ""));
        div.style.marginLeft = arrMargins[hNumber - 1] + "px";
        div.classList.add(arrClassesHeadings[hNumber]);
      } else {
        div.style.marginLeft = arrMargins[hNumber] + "px";
        div.classList.add(arrClassesData[hNumber]);
      }
    }
}
function cleanSectionModifications(arrDivs) {
  for (const div of arrDivs) {
    div.style.marginLeft = null;
    div.classList.forEach((item) => {
      if (item.startsWith("data_") || item.startsWith("heading_")) {
        div.classList.remove(item);
      }
    });
  }
}

// src/settings.ts
var import_obsidian = __toModule(require("obsidian"));
var DEFAULT_SETTINGS = {
  h1: "30",
  h2: "50",
  h3: "70",
  h4: "90",
  h5: "110",
  h6: "130"
};
var IndentSettingTab = class extends import_obsidian.PluginSettingTab {
  constructor(app2, plugin) {
    super(app2, plugin);
    this.plugin = plugin;
  }
  display() {
    const { containerEl } = this;
    containerEl.empty();
    containerEl.createEl("h2", { text: "Set identations for each heading (in pixels)" });
    new import_obsidian.Setting(containerEl).setName("H1 Identation").addText((number) => number.setPlaceholder("").setValue(this.plugin.settings.h1).onChange((value) => __async(this, null, function* () {
      this.plugin.settings.h1 = value;
      yield this.plugin.saveSettings();
    })));
    new import_obsidian.Setting(containerEl).setName("H2 Identation").addText((text) => text.setPlaceholder("").setValue(this.plugin.settings.h2).onChange((value) => __async(this, null, function* () {
      this.plugin.settings.h2 = value;
      yield this.plugin.saveSettings();
    })));
    new import_obsidian.Setting(containerEl).setName("H3 Identation").addText((text) => text.setPlaceholder("").setValue(this.plugin.settings.h3).onChange((value) => __async(this, null, function* () {
      this.plugin.settings.h3 = value;
      yield this.plugin.saveSettings();
    })));
    new import_obsidian.Setting(containerEl).setName("H4 Identation").addText((text) => text.setPlaceholder("").setValue(this.plugin.settings.h4).onChange((value) => __async(this, null, function* () {
      this.plugin.settings.h4 = value;
      yield this.plugin.saveSettings();
    })));
    new import_obsidian.Setting(containerEl).setName("H5 Identation").addText((text) => text.setPlaceholder("").setValue(this.plugin.settings.h5).onChange((value) => __async(this, null, function* () {
      this.plugin.settings.h5 = value;
      yield this.plugin.saveSettings();
    })));
    new import_obsidian.Setting(containerEl).setName("H6 Identation").addText((text) => text.setPlaceholder("").setValue(this.plugin.settings.h6).onChange((value) => __async(this, null, function* () {
      this.plugin.settings.h6 = value;
      yield this.plugin.saveSettings();
    })));
  }
};

// src/main.ts
var HeadingIndent = class extends import_obsidian2.Plugin {
  onload() {
    return __async(this, null, function* () {
      yield this.loadSettings();
      console.log("plugin Heading Indent Settings loaded");
      this.addSettingTab(new IndentSettingTab(this.app, this));
      this.app.workspace.onLayoutReady(() => {
        wrapperIndentPreview(this, 100, false);
        wrapperIndentPreview(this, 300, false);
        wrapperIndentPreview(this, 1e3, false);
        setObserverToActiveLeaf(this);
      });
      this.registerEvent(this.app.workspace.on("active-leaf-change", () => {
        const mode = app.workspace.getActiveViewOfType(import_obsidian2.MarkdownView).getMode();
        indentPreview(this);
        wrapperIndentPreview(this, 100, false);
        setObserverToActiveLeaf(this);
      }));
      this.registerEvent(this.app.workspace.on("layout-change", () => {
        setObserverToActiveLeaf(this);
      }));
    });
  }
  onunload() {
    this.previewObserver && this.previewObserver.disconnect();
  }
  loadSettings() {
    return __async(this, null, function* () {
      this.settings = Object.assign({}, DEFAULT_SETTINGS, yield this.loadData());
    });
  }
  saveSettings() {
    return __async(this, null, function* () {
      yield this.saveData(this.settings);
      indentPreview(this);
    });
  }
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjL21haW4udHMiLCAic3JjL3ByZXZpZXdfaW5kZW50aW5nLnRzIiwgInNyYy9zZXR0aW5ncy50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiaW1wb3J0IHsgTWFya2Rvd25WaWV3LCBQbHVnaW4gfSBmcm9tICdvYnNpZGlhbic7XHJcbmltcG9ydCB7IHdyYXBwZXJJbmRlbnRQcmV2aWV3LCBpbmRlbnRQcmV2aWV3LCBzZXRPYnNlcnZlclRvQWN0aXZlTGVhZiB9IGZyb20gXCIuL3ByZXZpZXdfaW5kZW50aW5nXCI7XHJcbmltcG9ydCB7IEluZGVudFNldHRpbmdUYWIsIEhlYWRpbmdJbmRlbnRTZXR0aW5ncywgREVGQVVMVF9TRVRUSU5HUyB9IGZyb20gJy4vc2V0dGluZ3MnO1xyXG5cclxuLy8gaW1wb3J0IHsgQXBwLCBFZGl0b3IsIFBsdWdpblNldHRpbmdUYWIsIE1hcmtkb3duUG9zdFByb2Nlc3NvckNvbnRleHQsIFNldHRpbmcsIE1hcmtkb3duUHJldmlld1JlbmRlcmVyIH0gZnJvbSAnb2JzaWRpYW4nO1xyXG5cclxuLy8gZGVjbGFyZSBtb2R1bGUgXCJvYnNpZGlhblwiIHtcclxuLy8gXHRpbnRlcmZhY2UgQXBwIHtcclxuLy8gXHRcdC8vIHRyaWNrIGNvbiBlbCA8ZmxhZz4gcGFyYSBxdWUgbGEgZnVuY2lvbiBzZSBwcm9jZXNlIGxhcyBtaW5pbWFzIHZlY2VzIHBvc2libGVzXHJcbi8vIFx0XHRmbGFnRXhlY3V0ZT86IG51bWJlcixcclxuLy8gXHRcdC8vIHNhdmUgb2JzZXJ2ZXIgaW4gYXBwLnZhcmlhYmxlIGluIG9yZGVyIHRvIGNvbnRyb2wgYW5kIHByZXZlbnQgc3RhY2tpbmcgb2Ygb2JzZXJ2ZXJzXHJcbi8vIFx0XHRwcmV2aWV3T2JzZXJ2ZXI/OiBhbnlcclxuLy8gXHR9XHJcbi8vIH1cclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBIZWFkaW5nSW5kZW50IGV4dGVuZHMgUGx1Z2luIHtcclxuXHRzZXR0aW5nczogSGVhZGluZ0luZGVudFNldHRpbmdzO1xyXG5cdGZsYWdFeGVjdXRlPzogbnVtYmVyOyAvLyB0cmljayBjb24gZWwgPGZsYWc+IHBhcmEgcXVlIGxhIGZ1bmNpb24gc2UgcHJvY2VzZSBsYXMgbWluaW1hcyB2ZWNlcyBwb3NpYmxlc1xyXG5cdHByZXZpZXdPYnNlcnZlcj86IGFueTsgLy8gc2F2ZSBvYnNlcnZlciBpbiBhcHAudmFyaWFibGUgaW4gb3JkZXIgdG8gY29udHJvbCBhbmQgcHJldmVudCBzdGFja2luZyBvZiBvYnNlcnZlcnNcclxuXHJcblx0Ly8gQ29uZmlndXJlIHJlc291cmNlcyBuZWVkZWQgYnkgdGhlIHBsdWdpbi5cclxuXHRhc3luYyBvbmxvYWQoKSB7XHJcblx0XHRhd2FpdCB0aGlzLmxvYWRTZXR0aW5ncygpO1xyXG5cdFx0XHJcblx0XHRjb25zb2xlLmxvZyhcInBsdWdpbiBIZWFkaW5nIEluZGVudCBTZXR0aW5ncyBsb2FkZWRcIik7XHJcblxyXG5cdFx0Ly8gVGhpcyBhZGRzIGEgc2V0dGluZ3MgdGFiIHNvIHRoZSB1c2VyIGNhbiBjb25maWd1cmUgdmFyaW91cyBhc3BlY3RzIG9mIHRoZSBwbHVnaW5cclxuXHRcdHRoaXMuYWRkU2V0dGluZ1RhYihuZXcgSW5kZW50U2V0dGluZ1RhYih0aGlzLmFwcCwgdGhpcykpO1xyXG5cclxuXHRcdC8vICsrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrK1xyXG5cdFx0Ly8gcmVnaXN0ZXJNYXJrZG93blBvc3RQcm9jZXNzb3IgY2FsbGJhY2sgaXMgZm9yIGNyZWF0aW9uIG9mIG5ldyBodG1sIGVsZW1lbnRzLCBidXQgaSBoYXZlIHRvIFxyXG5cdFx0Ly8gbWFuaXB1bGF0ZSB0aGUgcmVuZGVyZWQgZG9tIG9mIGV4aXN0aW5nIGVsZW1lbnRzLiBmb3IgZXhhbXBsZSB0aGUgZGl2IHRoYXQgY29udGFpbnMgYSBwYXJhZ3JhcGguIFxyXG5cdFx0Ly8gVGhlIGNhbGxiYWNrIGByZWdpc3Rlck1hcmtkb3duUG9zdFByb2Nlc3NvcmAgaXMgY2FsbGVkIG4gdGltZXMsIGRlcGVuZGluZyBvbiB0aGUgbnVtYmVyIG9mIGVsZW1lbnRzXHJcblx0XHQvLyAocGFyYWdyYXBoLCBjb2RlLWJsb2NrLCBoZWFkaW5nLCBldGMpIGFyZSBtb2RpZmllZCBiZWZvcmUgdG9nZ2xpbmcgdG8gcmVhZGluZyB2aWV3LiBpLmUuLCBpZiBpIG1vZGlmeSBcclxuXHRcdC8vIG9uZSBoZWFkZXIgYW5kIDIgcGFyYWdyYXBzLCB0aGlzIGNhbGxiYWNrIHdpbGwgYmUgZmlyZWQgMyB0aW1lcyB3aGVuIHJlYWRpbmcgdmlldyB3aWxsIGJlIGFjdGl2YXRlZCwgXHJcblx0XHQvLyBlYWNoIHRpbWUgcGFzc2luZyB0aGUgY29ycmVzcG9uZGluZyBtb2RpZmllZCBlbGVtZW50LiBUaGlzIHByZWNpc2VseSBpcyB0aGUgcHJvYmxlbSAtIGkganVzdCBuZWVkIFxyXG5cdFx0Ly8gc29tZXRoaW5nIGxpa2UgZG9jdW1lbnQucmVhZHksIHRoYXQgd2lsbCBiZSBmaXJlIG9ubHkgb25jZSwgd2hlbiBBTEwgbW9kaWZpZWQgZWxlbWVudHMgYXJlIGFscmVhZHkgXHJcblx0XHQvLyByZW5kZXJlZCwgc28gaSBjYW4gd29yayBvbiB0aGUgd2hvbGUgcmVuZGVyZWQgRE9NIGFuZCBub3Qgb24gZWFjaCBtb2RpZmllZCBlbGVtZW50IHNlcGFyYXRlbHkuXHJcblx0XHQvLyArKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKytcclxuXHRcdC8vIHRoaXMucmVnaXN0ZXJNYXJrZG93blBvc3RQcm9jZXNzb3IoKGVsLCBjdHgpID0+IHtcclxuXHJcblx0XHRcdC8vIGNvbnN0IG1hcmtkb3duVmlldyA9IHRoaXMuYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVWaWV3T2ZUeXBlKE1hcmtkb3duVmlldyk7XHJcblx0XHRcdC8vIGNvbnN0IG1vZGUgPSBtYXJrZG93blZpZXcuZ2V0TW9kZSgpO1xyXG5cdFx0XHQvLyBtYXJrZG93blZpZXcucHJldmlld01vZGUucmVuZGVyZXIuc2VjdGlvbnNcclxuXHRcdFx0Ly8gY29uc29sZS5sb2cobWFya2Rvd25WaWV3LnByZXZpZXdNb2RlLnJlbmRlcmVyLnNlY3Rpb25zKTtcclxuXHJcblx0XHRcdC8vIHdyYXBwZXJJbmRlbnRQcmV2aWV3KHRoaXMsMTAwLHRydWUpO1xyXG5cdFx0Ly8gfSwgMClcclxuXHJcblxyXG5cdFx0Ly8gV2hlbiBvYnNpZGlhbiBpbiBzdGFydGVkXHJcblx0XHR0aGlzLmFwcC53b3Jrc3BhY2Uub25MYXlvdXRSZWFkeSgoKSA9PiB7XHJcblx0XHRcdC8vIGNvbnNvbGUubG9nKFwiXHUyQjUwb25MYXlvdXRSZWFkeVwiKTtcclxuXHJcblx0XHRcdC8vIHJ1biB3aXRob3V0IGJsb2NraW5nICh3aXRob3V0IGZsYWcpXHJcblx0XHRcdHdyYXBwZXJJbmRlbnRQcmV2aWV3KHRoaXMsMTAwLGZhbHNlKTtcclxuXHRcdFx0d3JhcHBlckluZGVudFByZXZpZXcodGhpcywzMDAsZmFsc2UpO1xyXG5cdFx0XHR3cmFwcGVySW5kZW50UHJldmlldyh0aGlzLDEwMDAsZmFsc2UpO1xyXG5cclxuICAgICAgICAgICAgc2V0T2JzZXJ2ZXJUb0FjdGl2ZUxlYWYodGhpcyk7XHJcblx0XHRcdFxyXG4gICAgICAgIH0pO1xyXG5cclxuXHRcdC8vIFdoZW4gdGFiIGlzIHN3aXRjaGVkXHJcblx0XHR0aGlzLnJlZ2lzdGVyRXZlbnQodGhpcy5hcHAud29ya3NwYWNlLm9uKFwiYWN0aXZlLWxlYWYtY2hhbmdlXCIsICgpID0+IHtcclxuXHRcdFx0Ly8gY29uc29sZS5sb2coXCJcdTJCNTBcdTJCNTBldmVudDphY3RpdmUtbGVhZi1jaGFuZ2VcIik7XHJcblxyXG5cdFx0XHRjb25zdCBtb2RlID0gYXBwLndvcmtzcGFjZS5nZXRBY3RpdmVWaWV3T2ZUeXBlKE1hcmtkb3duVmlldykuZ2V0TW9kZSgpO1xyXG5cclxuXHRcdFx0LyoqXHJcblx0XHRcdCAqIHJ1biBkaXJlY3RseSAod2l0aG91dCB0aW1lb3V0ICYgZmxhZykgaW4gb3JkZXIgdG8gYXBwbHkgaW5kZW50IGZhc3RlclxyXG5cdFx0XHQgKiBwcm9jZXNzIHRoZSBzZWN0aW9ucyB0aGF0IGFyZSBhbHJlYWR5IHJlbmRlcmVkOyB0aGUgcmVzdCBvZiB0aGUgc2VjdGlvbnNcclxuXHRcdFx0ICogKHdoaWNoIG5vdCByZW5kZXJlZCB5ZXQpIHdlIHdpbGwgcHJvY2VzcyB3aXRoIG9ic2VydmVyIGNhbGxiYWNrXHJcblx0XHRcdCAqL1xyXG5cdFx0XHRpbmRlbnRQcmV2aWV3KHRoaXMpO1xyXG5cclxuXHRcdFx0LyoqXHJcblx0XHRcdCAqIHdoZW4gbGVhZiBpcyBvcGVuZWQgPGluIG5ldyB0YWI+IGZyb20gPHF1aWNrLXN3aXRjaGVyPiBhbmQgaXRzIGNvbnRlbnQgZml0cyBpbnRvXHJcblx0XHRcdCAqIHRoZSA8dmlld3BvcnQ+LCBpdHMgbm90IHRyaWdnZXJpbmcgb2JzZXJ2ZXIgY2FsbGJhY2ssIEkgZ3Vlc3MgaXRzIGN1eiB0aGUgZGl2cyBhcmUgXHJcblx0XHRcdCAqIHJlbmRlcmVkIGF0IG9uY2VcclxuXHRcdFx0ICogXHJcblx0XHRcdCAqIFJ1biB3aXRob3V0IGZsYWcgY3V6IEkgdGhpbmsgd2lsbCBiZSBiZXR0ZXIgZm9yIG90aGVyIGNhc2VzIC0gaXR3b250IGJlIGJsb2NraW5nIFxyXG5cdFx0XHQgKiBzdWJzZXF1ZW50IGNhbGxzIGZyb20gb2JzZXJ2ZXIgY2FsbGJhY2sgXHJcblx0XHRcdCAqL1xyXG5cdFx0XHR3cmFwcGVySW5kZW50UHJldmlldyh0aGlzLDEwMCxmYWxzZSk7XHJcblxyXG5cdFx0XHRzZXRPYnNlcnZlclRvQWN0aXZlTGVhZih0aGlzKTtcclxuXHRcdH0pKTtcclxuXHJcblxyXG5cdFx0Ly8gV2hlbiB0b2dnbGUgYmV0d2VlbiBzb3VyY2UvcHJldmlldyBtb2RlXHJcblx0XHR0aGlzLnJlZ2lzdGVyRXZlbnQodGhpcy5hcHAud29ya3NwYWNlLm9uKFwibGF5b3V0LWNoYW5nZVwiLCAoKSA9PiB7XHJcblx0XHRcdFxyXG5cdFx0XHRzZXRPYnNlcnZlclRvQWN0aXZlTGVhZih0aGlzKTtcclxuXHRcdH0pKTtcclxuXHJcblxyXG5cclxuXHJcblx0XHQvLyB0aGlzLnJlZ2lzdGVyRXZlbnQodGhpcy5hcHAud29ya3NwYWNlLm9uKFwiZWRpdG9yLWNoYW5nZVwiLCAoZWRpdG9yOiBFZGl0b3IsIE1hcmtkb3duVmlldzogTWFya2Rvd25WaWV3KSA9PiB7XHJcblx0XHQvLyBcdC8vIGNvbnNvbGUubG9nKFwiXHUyQjUwXHUyQjUwZXZlbnQ6ZWRpdG9yLWNoYW5nZVwiKTtcclxuXHJcblx0XHQvLyBcdC8vIGxldCBjdXJyZW50TGluZSA9IGVkaXRvci5nZXRDdXJzb3IoKS5saW5lO1xyXG5cdFx0Ly8gXHQvLyBjb25zb2xlLmxvZyhlZGl0b3IuZ2V0TGluZShjdXJyZW50TGluZSkpO1xyXG5cclxuXHRcdC8vIFx0Y29uc29sZS5sb2coZWRpdG9yKTtcclxuXHRcdC8vIFx0ZGF2YXlJbmRlbnRTb3VyY2UodGhpcyk7XHJcblxyXG5cdFx0Ly8gXHQvLyB3cmFwcGVySW5kZW50UHJldmlldyh0aGlzLDEwMCx0cnVlKTtcclxuXHRcdC8vIH0pKTtcclxuXHJcblxyXG5cclxuXHRcdC8vdG9kbzogc291cmNlXHJcblx0XHQvLyAud29ya3NwYWNlLWxlYWYubW9kLWFjdGl2ZSAubWFya2Rvd24tc291cmNlLXZpZXcgLmNtLWNvbnRlbnRDb250YWluZXIgPiBkaXY6bnRoLWNoaWxkKDIpXHJcblx0XHQvLyB0aGlzLnJlZ2lzdGVyRWRpdG9yRXh0ZW5zaW9uKGFjdGl2ZVZpc3VhbExpbmUpO1xyXG5cdFx0Ly8gcmVmIGR5bmFtaWMgaGlnaGxpZ2h0IHBsdWcgayBjcmVhIHNwYW4gaW5zaWRlIGNtLWxpbmVcclxuXHR9XHJcblxyXG5cdC8vIFJlbGVhc2UgYW55IHJlc291cmNlcyBjb25maWd1cmVkIGJ5IHRoZSBwbHVnaW4uXHJcblx0b251bmxvYWQoKSB7XHJcblx0XHQvLyBpZiAodGhpcy5wcmV2aWV3T2JzZXJ2ZXIgIT09IHVuZGVmaW5lZCkgdGhpcy5wcmV2aWV3T2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xyXG5cdFx0dGhpcy5wcmV2aWV3T2JzZXJ2ZXIgJiYgdGhpcy5wcmV2aWV3T2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xyXG5cdH1cclxuXHJcblx0YXN5bmMgbG9hZFNldHRpbmdzKCkge1xyXG5cdFx0dGhpcy5zZXR0aW5ncyA9IE9iamVjdC5hc3NpZ24oe30sIERFRkFVTFRfU0VUVElOR1MsIGF3YWl0IHRoaXMubG9hZERhdGEoKSk7XHJcblx0fVxyXG5cclxuXHRhc3luYyBzYXZlU2V0dGluZ3MoKSB7XHJcblx0XHRhd2FpdCB0aGlzLnNhdmVEYXRhKHRoaXMuc2V0dGluZ3MpO1xyXG5cdFx0aW5kZW50UHJldmlldyh0aGlzKTtcclxuXHR9XHJcblxyXG59XHJcblxyXG5cclxuXHJcblxyXG4vLyBpbmRlbnRTb3VyY2UoKSB7XHJcblx0XHJcbi8vIFx0Y29uc29sZS5sb2coXCJcdUQ4M0NcdURGMzJcdUQ4M0NcdURGMzJcdUQ4M0NcdURGMzJcdUQ4M0NcdURGMzJcdUQ4M0NcdURGMzJcdUQ4M0NcdURGMzJcdUQ4M0NcdURGMzJcdUQ4M0NcdURGMzIgZGF2YXlJbmRlbnQge1NPVVJDRX1cIik7XHJcblxyXG4vLyBcdC8vIGxpbmVzXHJcbi8vIFx0Y29uc3QgZGl2c05vZGVMaXN0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbDxIVE1MRWxlbWVudD4oc2VsZWN0b3JbXCJzb3VyY2VcIl0gKyBcIiA+IGRpdi5jbS1saW5lXCIpO1xyXG4vLyBcdGlmICghZGl2c05vZGVMaXN0KXtyZXR1cm59XHJcblx0XHJcbi8vIFx0Y29uc3QgYXJyRGl2cyA9IEFycmF5LmZyb20oZGl2c05vZGVMaXN0KTtcclxuXHRcclxuLy8gXHQvLyBjbGVhblNlY3Rpb25Nb2RpZmljYXRpb25zKGFyckRpdnMpO1xyXG5cclxuLy8gXHRjb25zdCBhcnJNYXJnaW5zOiBEaWN0aW9uYXJ5PG51bWJlcj4gPSB7XHJcbi8vIFx0XHQwOiAwLCAvLyBubyBoZWFkaW5nXHJcbi8vIFx0XHQxOiBwYXJzZUludChzZXR0aW5ncy5oMSkgfHwgMCxcclxuLy8gXHRcdDI6IHBhcnNlSW50KHNldHRpbmdzLmgyKSB8fCAwLFxyXG4vLyBcdFx0MzogcGFyc2VJbnQoc2V0dGluZ3MuaDMpIHx8IDAsXHJcbi8vIFx0XHQ0OiBwYXJzZUludChzZXR0aW5ncy5oNCkgfHwgMCxcclxuLy8gXHRcdDU6IHBhcnNlSW50KHNldHRpbmdzLmg1KSB8fCAwLFxyXG4vLyBcdFx0NjogcGFyc2VJbnQoc2V0dGluZ3MuaDYpIHx8IDAsXHJcbi8vIFx0XHQvLyAxOiAwLFxyXG4vLyBcdFx0Ly8gMjogMCxcclxuLy8gXHRcdC8vIDM6IDAsXHJcbi8vIFx0XHQvLyA0OiA1MSxcclxuLy8gXHRcdC8vIDU6IDEwMCxcclxuLy8gXHRcdC8vIDY6IDE1MCxcclxuLy8gXHR9O1xyXG5cclxuXHRcclxuLy8gXHRsZXQgaE51bWJlcjogbnVtYmVyID0gMDtcclxuXHJcbi8vIFx0c3VjazogZm9yIChjb25zdCBkaXYgb2YgYXJyRGl2cykge1xyXG5cclxuLy8gXHRcdGxldCBjdXJyZW50RGl2SXNIZWFkaW5nID0gZGl2LmNsYXNzTGlzdC5jb250YWlucyhcIkh5cGVyTUQtaGVhZGVyXCIpO1xyXG5cdFx0XHJcbi8vIFx0XHRpZiAoY3VycmVudERpdklzSGVhZGluZykge1xyXG5cdFx0XHRcclxuLy8gXHRcdFx0bGV0IHNwYW5Ob2RlTGlzdCA9IGRpdi5xdWVyeVNlbGVjdG9yQWxsKCdzcGFuLmNtLWhlYWRlcicpO1xyXG5cclxuLy8gXHRcdFx0aWYgKHNwYW5Ob2RlTGlzdFswXS5jbGFzc0xpc3QuY29udGFpbnMoXCJjbS1oZWFkZXItMVwiKSkge2hOdW1iZXI9MX1cclxuLy8gXHRcdFx0aWYgKHNwYW5Ob2RlTGlzdFswXS5jbGFzc0xpc3QuY29udGFpbnMoXCJjbS1oZWFkZXItMlwiKSkge2hOdW1iZXI9Mn1cclxuLy8gXHRcdFx0aWYgKHNwYW5Ob2RlTGlzdFswXS5jbGFzc0xpc3QuY29udGFpbnMoXCJjbS1oZWFkZXItM1wiKSkge2hOdW1iZXI9M31cclxuLy8gXHRcdFx0aWYgKHNwYW5Ob2RlTGlzdFswXS5jbGFzc0xpc3QuY29udGFpbnMoXCJjbS1oZWFkZXItNFwiKSkge2hOdW1iZXI9NH1cclxuLy8gXHRcdFx0aWYgKHNwYW5Ob2RlTGlzdFswXS5jbGFzc0xpc3QuY29udGFpbnMoXCJjbS1oZWFkZXItNVwiKSkge2hOdW1iZXI9NX1cclxuLy8gXHRcdFx0aWYgKHNwYW5Ob2RlTGlzdFswXS5jbGFzc0xpc3QuY29udGFpbnMoXCJjbS1oZWFkZXItNlwiKSkge2hOdW1iZXI9Nn1cclxuXHJcblxyXG4vLyBcdFx0XHQvLyBkaXYuc3R5bGUubWFyZ2luTGVmdCA9IGFyck1hcmdpbnNbaE51bWJlci0xXStcInB4XCI7XHJcblx0XHRcdFxyXG4vLyBcdFx0XHQvLyBkaXYuY2xhc3NMaXN0LmFkZChhcnJDbGFzc2VzSGVhZGluZ3NbaE51bWJlcl0pO1xyXG5cclxuLy8gXHRcdFx0ZGl2LmNsYXNzTGlzdC5hZGQoYXJyQ2xhc3Nlc0hlYWRpbmdzW2hOdW1iZXJdKTtcclxuXHJcblxyXG4vLyBcdFx0XHQvL3RvZG86XHJcbi8vIFx0XHRcdC8vIHZhciBsaW5lID0gY20uYWRkTGluZUNsYXNzKGksIFwid3JhcFwiLCBcIkNvZGVNaXJyb3ItYWN0aXZlbGluZVwiKTtcclxuLy8gXHRcdFx0Ly8gbGluZXMucHVzaChsaW5lKTtcclxuXHJcbi8vIFx0XHR9ZWxzZXtcclxuXHJcbi8vIFx0XHRcdC8vIGRpdi5zdHlsZS5tYXJnaW5MZWZ0ID0gYXJyTWFyZ2luc1toTnVtYmVyXStcInB4XCI7XHJcbi8vIFx0XHRcdGRpdi5jbGFzc0xpc3QuYWRkKGFyckNsYXNzZXNEYXRhW2hOdW1iZXJdKTtcclxuLy8gXHRcdH1cclxuLy8gXHR9XHJcbi8vIH0iLCAiaW1wb3J0IHsgQXBwLCBFZGl0b3IsIE1hcmtkb3duVmlldywgU2V0dGluZyB9IGZyb20gJ29ic2lkaWFuJztcbmltcG9ydCB7IERlY29yYXRpb25TZXQsIEVkaXRvclZpZXcsIFZpZXdQbHVnaW4sIFZpZXdVcGRhdGUgfSBmcm9tIFwiQGNvZGVtaXJyb3Ivdmlld1wiO1xuaW1wb3J0IEhlYWRpbmdJbmRlbnQgZnJvbSAnLi9tYWluJztcblxuaW50ZXJmYWNlIERpY3Rpb25hcnk8VHlwZT4ge1xuXHRba2V5OiBzdHJpbmddOiBUeXBlO1xufVxuXG5jb25zdCBjb250YWluZXJTZWxlY3Rvcjogc3RyaW5nID0gXCIud29ya3NwYWNlLWxlYWYubW9kLWFjdGl2ZSAubWFya2Rvd24tcmVhZGluZy12aWV3IC5tYXJrZG93bi1wcmV2aWV3LXNlY3Rpb25cIjtcblxuY29uc3QgYXJyQ2xhc3Nlc0hlYWRpbmdzOiBEaWN0aW9uYXJ5PHN0cmluZz4gPSB7XG5cdDE6IFwiaGVhZGluZ19oMVwiLFxuXHQyOiBcImhlYWRpbmdfaDJcIixcblx0MzogXCJoZWFkaW5nX2gzXCIsXG5cdDQ6IFwiaGVhZGluZ19oNFwiLFxuXHQ1OiBcImhlYWRpbmdfaDVcIixcblx0NjogXCJoZWFkaW5nX2g2XCIsXG59O1xuXG5jb25zdCBhcnJDbGFzc2VzRGF0YTogRGljdGlvbmFyeTxzdHJpbmc+ID0ge1xuXHQwOiBcImRhdGFfbm8taGVhZGluZ1wiLFxuXHQxOiBcImRhdGFfaDFcIixcblx0MjogXCJkYXRhX2gyXCIsXG5cdDM6IFwiZGF0YV9oM1wiLFxuXHQ0OiBcImRhdGFfaDRcIixcblx0NTogXCJkYXRhX2g1XCIsXG5cdDY6IFwiZGF0YV9oNlwiLFxufTtcblxuXG4vKipcbiAqIFRoZSBvYnNlcnZlciBjYWxsYmFjayB3aWxsIHRyaWdnZXIgZWFjaCB0aW1lIHNlY3Rpb25zIChwcmV2aWV3KSAvIGxpbmVzIChzb3VyY2UpIGFyZSBhZGRlZC9yZW1vdmVkXG4gKiBcbiAqIFtwcmV2aWV3XVxuICogXHQgIFdoZW4gcHJldmlldyBpcyB0b2dnbGVkIGFuZCB0aGVyZSBhcmUgY2hhbmdlcyBpbiBzZWN0aW9ucyB0byBiZSByZW5kZXJlZFxuICogXG4gKiBbcHJldmlldyxzb3VyY2VdXG4gKiBcdCAgV2hlbiBzd2l0Y2ggbm90ZSwgdGhlIHNlY3Rpb25zIHdpbGwgYmUgcmVuZGVyZWRcbiAqIFxuICogXHQgIElmIHRoZSBhY3RpdmUgbGVhZiBpcyBsYXJnZSAocHJldmlldyBpcyBjb2RlbWlycm9yIGFuZCBpdCBcbiAqICAgIHN1cHBvcnRzIGh1Z2UgZmlsZXMpICB0aGUgY2FsbGJhY2sgdHJpZ2dlcnMgd2hpbGUgd2Ugc2Nyb2xsLCBjdXogdGhlIGVkaXRvciBvbmx5IFxuICogICAgcmVuZGVycyB0aGUgZWRpdG9yJ3Mgdmlld3BvcnQgKHRoYXQgcmVuZGVycyBvbmx5IHdoYXQncyBpcyB2aXNpYmxlKVxuICogICAgaHR0cHM6Ly9tYXJjdXMuc2UubmV0L29ic2lkaWFuLXBsdWdpbi1kb2NzL2VkaXRvci9leHRlbnNpb25zL3ZpZXdwb3J0XG4gKiBcbiAqIFx0ICBUcmlnZ2VyIHdoZW4gaGVhZGluZyBmb2xkL3VuZm9sZDsgc2kgYWJyaW1vcyBub3RhIHkgYWxndW4gaGVhZGluZyBlc3RhIG9jdWx0byxcbiAqICAgIGxhIGZ1bmNpb24gYWwgZWplY3V0YXJzZSBwcmV2aWFtZW50ZSBubyBoaXpvIG5hZGEgY29uIGVzb3MgZGl2cyBwb3JxdWUgY3VhbmRvIFxuICogICAgZXN0YW4gb2N1bHRvcywgZGVzYXBhcmVjZW4gZGVsIERPTVxuICovXG5leHBvcnQgZnVuY3Rpb24gc2V0T2JzZXJ2ZXJUb0FjdGl2ZUxlYWYocGx1Z2luOiBIZWFkaW5nSW5kZW50KXtcblxuICAgIGlmIChwbHVnaW4ucHJldmlld09ic2VydmVyICE9PSB1bmRlZmluZWQpe1xuICAgICAgICAvLyBwcmV2ZW50IHN0YWNraW5nOiBkaXNjb25uZWN0IGV4aXN0aW5nIG9ic2VydmVyIGZpcnN0IGJlZm9yZSBjcmVhdGluZyBhIG5ldyBvbmVcbiAgICAgICAgcGx1Z2luLnByZXZpZXdPYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gICAgfVxuXG4gICAgLy8gYGFjdGl2ZURjb3VtZW50YCBpbnN0ZWFkIG9mIGBkb2N1bWVudGAgdG8gd29yayBpbiBvYnNpZGlhbi1wb3B1cHMgXG4gICAgY29uc3QgdGFyZ2V0Tm9kZSA9IGFjdGl2ZURvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoY29udGFpbmVyU2VsZWN0b3IpOyBcblxuICAgIC8vIGlmIG5ldyB0YWIgaXMgb3BlbmVkIChjdHJsK3QpIHRoZSBsZWFmIGlzIGVtcHR5IGFuZCB0YXJnZXROb2RlIGlzIG51bGxcbiAgICBpZiAodGFyZ2V0Tm9kZSA9PSBudWxsKXtcbiAgICAgICAgY29uc29sZS5sb2coXCJ0YXJnZXQgbm9kZSBpcyBOVUxMXCIpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gT3B0aW9ucyBmb3IgdGhlIG9ic2VydmVyICh3aGljaCBtdXRhdGlvbnMgdG8gb2JzZXJ2ZSlcbiAgICBjb25zdCBjb25maWcgPSB7IGNoaWxkTGlzdDogdHJ1ZSB9O1xuXG4gICAgLy8gQ2FsbGJhY2sgZnVuY3Rpb24gdG8gZXhlY3V0ZSB3aGVuIG11dGF0aW9ucyBhcmUgb2JzZXJ2ZWRcbiAgICBjb25zdCBjYWxsYmFjayA9IChtdXRhdGlvbkxpc3Q6IGFueSwgb2JzZXJ2ZXI6IGFueSkgPT4ge1xuICAgICAgICBcbiAgICAgICAgZm9yIChjb25zdCBtdXRhdGlvbiBvZiBtdXRhdGlvbkxpc3QpIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKG11dGF0aW9uLnR5cGUgPT09ICdjaGlsZExpc3QnKSB7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ0EgY2hpbGQgbm9kZSBoYXMgYmVlbiBhZGRlZCBvciByZW1vdmVkLicpO1xuICAgICAgICAgICAgICAgIC8vIGluZGVudFByZXZpZXcocGx1Z2luKTtcbiAgICAgICAgICAgICAgICB3cmFwcGVySW5kZW50UHJldmlldyhwbHVnaW4sMTAwLHRydWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8vIENyZWF0ZSBhbiBvYnNlcnZlciBpbnN0YW5jZSBsaW5rZWQgdG8gdGhlIGNhbGxiYWNrIGZ1bmN0aW9uXG4gICAgcGx1Z2luLnByZXZpZXdPYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKGNhbGxiYWNrKTtcbiAgICAvLyBTdGFydCBvYnNlcnZpbmcgdGhlIHRhcmdldCBub2RlIGZvciBjb25maWd1cmVkIG11dGF0aW9uc1xuICAgIHBsdWdpbi5wcmV2aWV3T2JzZXJ2ZXIub2JzZXJ2ZSh0YXJnZXROb2RlLCBjb25maWcpO1xufVxuXG4vKipcbiAqIFxuICogQHBhcmFtIHRpbWVvdXQgXHRpbiBvcmRlciB0byBwcm9jZXNzIHdoZW4gdGhlIFwic2VjdGlvbnNcIiBhcmUgYWxyZWFkeSByZW5kZXJlZFxuICogQHBhcmFtIGZsYWcgXHRcdHNlZSB0aGlzLmZsYWdFeGVjdXRlIGludGVyZmFjZVxuICovXG5leHBvcnQgZnVuY3Rpb24gd3JhcHBlckluZGVudFByZXZpZXcocGx1Z2luOiBIZWFkaW5nSW5kZW50LCB0aW1lb3V0OiBudW1iZXIsIGZsYWc6IGJvb2xlYW4pe1xuXG4gICAgLy90b2RvOiBwbHVnaW4gXHRyZXRyaWV2ZSBzZXR0aW5ncyBpbiB0aGUgbWFpbiBmdW5jdGlvblxuXG4gICAgdGltZW91dCA9IHRpbWVvdXQgfHwgMTAwO1xuXG4gICAgaWYgKGZsYWcpe1xuXG4gICAgICAgIGlmIChwbHVnaW4uZmxhZ0V4ZWN1dGUgPT0gdW5kZWZpbmVkKSBwbHVnaW4uZmxhZ0V4ZWN1dGUgPSAxO1xuICAgIFxuICAgICAgICBpZiAocGx1Z2luLmZsYWdFeGVjdXRlID09IDEpe1xuICAgIFxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJ6YS1lLWItYS1zaGl0XCIpO1xuICAgICAgICAgICAgcGx1Z2luLmZsYWdFeGVjdXRlID0gMjtcbiAgICBcbiAgICAgICAgICAgIHNldFRpbWVvdXQoYXN5bmMgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBpbmRlbnRQcmV2aWV3KHBsdWdpbik7XG4gICAgICAgICAgICB9LCB0aW1lb3V0KVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICBwbHVnaW4uZmxhZ0V4ZWN1dGUgPSAxO1xuICAgICAgICAgICAgfSwgdGltZW91dCs1MClcbiAgICAgICAgfVxuXG4gICAgfWVsc2V7XG5cbiAgICAgICAgc2V0VGltZW91dChhc3luYyBmdW5jdGlvbigpe1xuICAgICAgICAgICAgaW5kZW50UHJldmlldyhwbHVnaW4pO1xuICAgICAgICB9LCB0aW1lb3V0KVxuICAgIH1cblxufVxuXG5leHBvcnQgZnVuY3Rpb24gaW5kZW50UHJldmlldyhwbHVnaW46IEhlYWRpbmdJbmRlbnQpIHtcbiAgICBjb25zdCBzZXR0aW5ncyA9IHBsdWdpbi5zZXR0aW5ncztcblxuICAgIC8vIGNvbnNvbGUubG9nKFwiXHVEODNDXHVERjMyXHVEODNDXHVERjMyXHVEODNDXHVERjMyXHVEODNDXHVERjMyXHVEODNDXHVERjMyXHVEODNDXHVERjMyXHVEODNDXHVERjMyXHVEODNDXHVERjMyIGRheUluZGVudCB7UFJFVklFV31cIik7XG5cbiAgICBjb25zdCBkaXZzTm9kZUxpc3QgPSBhY3RpdmVEb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsPEhUTUxFbGVtZW50Pihjb250YWluZXJTZWxlY3RvciArIFwiID4gZGl2XCIpO1xuICAgIGlmICghZGl2c05vZGVMaXN0KXtyZXR1cm59XG4gICAgXG4gICAgY29uc3QgYXJyRGl2cyA9IEFycmF5LmZyb20oZGl2c05vZGVMaXN0KTtcbiAgICBcbiAgICAvLyBkbyBub3QgcHJvY2VzcyBkaXZzIHdpdGggZm9sbG93aW5ncyBjbGFzc2VzXG4gICAgY29uc3QgZXhjbHVkZWRDbGFzc05hbWVzID0gWydtb2QtaGVhZGVyJywgJ21vZC1mb290ZXInLCAnbWFya2Rvd24tcHJldmlldy1wdXNoZXInXTtcbiAgICBcbiAgICBjbGVhblNlY3Rpb25Nb2RpZmljYXRpb25zKGFyckRpdnMpO1xuXG4gICAgY29uc3QgYXJyTWFyZ2luczogRGljdGlvbmFyeTxudW1iZXI+ID0ge1xuICAgICAgICAwOiAwLCAvLyBubyBoZWFkaW5nXG4gICAgICAgIDE6IHBhcnNlSW50KHNldHRpbmdzLmgxKSB8fCAwLFxuICAgICAgICAyOiBwYXJzZUludChzZXR0aW5ncy5oMikgfHwgMCxcbiAgICAgICAgMzogcGFyc2VJbnQoc2V0dGluZ3MuaDMpIHx8IDAsXG4gICAgICAgIDQ6IHBhcnNlSW50KHNldHRpbmdzLmg0KSB8fCAwLFxuICAgICAgICA1OiBwYXJzZUludChzZXR0aW5ncy5oNSkgfHwgMCxcbiAgICAgICAgNjogcGFyc2VJbnQoc2V0dGluZ3MuaDYpIHx8IDAsXG4gICAgICAgIC8vIDE6IDAsXG4gICAgICAgIC8vIDI6IDAsXG4gICAgICAgIC8vIDM6IDAsXG4gICAgICAgIC8vIDQ6IDUxLFxuICAgICAgICAvLyA1OiAxMDAsXG4gICAgICAgIC8vIDY6IDE1MCxcbiAgICB9O1xuXG4gICAgXG4gICAgbGV0IGhOdW1iZXI6IG51bWJlciA9IDA7XG5cbiAgICBzdWNrOiBmb3IgKGNvbnN0IGRpdiBvZiBhcnJEaXZzKSB7XG5cbiAgICAgICAgLy8gc2tpcCBleGNsdWRlZCBkaXZzXG4gICAgICAgIGlmIChleGNsdWRlZENsYXNzTmFtZXMuc29tZShjbGFzc05hbWUgPT4gZGl2LmNsYXNzTGlzdC5jb250YWlucyhjbGFzc05hbWUpKSkge1xuICAgICAgICAgICAgY29udGludWUgc3VjaztcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBoZWFkaW5nTm9kZUxpc3QgPSBkaXYucXVlcnlTZWxlY3RvckFsbCgnaDEsIGgyLCBoMywgaDQsIGg1LCBoNicpLFxuICAgICAgICAgICAgY3VycmVudERpdklzSGVhZGluZyA9IGhlYWRpbmdOb2RlTGlzdC5sZW5ndGggPiAwO1xuXG4gICAgICAgIGlmIChjdXJyZW50RGl2SXNIZWFkaW5nKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGxldCBoVGFnOiBzdHJpbmcgPSBoZWFkaW5nTm9kZUxpc3RbMF0udGFnTmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBoTnVtYmVyID0gcGFyc2VJbnQoaFRhZy5yZXBsYWNlKC9eXFxEKy9nLCAnJykpOyAvLyBoNSAtPiA1LCBoMSAtPiAxLCBldGMuXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGRpdi5zdHlsZS5tYXJnaW5MZWZ0ID0gYXJyTWFyZ2luc1toTnVtYmVyLTFdK1wicHhcIjtcbiAgICAgICAgICAgIGRpdi5jbGFzc0xpc3QuYWRkKGFyckNsYXNzZXNIZWFkaW5nc1toTnVtYmVyXSk7XG5cbiAgICAgICAgfWVsc2V7XG5cbiAgICAgICAgICAgIGRpdi5zdHlsZS5tYXJnaW5MZWZ0ID0gYXJyTWFyZ2luc1toTnVtYmVyXStcInB4XCI7XG4gICAgICAgICAgICBkaXYuY2xhc3NMaXN0LmFkZChhcnJDbGFzc2VzRGF0YVtoTnVtYmVyXSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIGNsZWFuU2VjdGlvbk1vZGlmaWNhdGlvbnMoYXJyRGl2czogYW55KSB7XG5cbiAgICBmb3IgKGNvbnN0IGRpdiBvZiBhcnJEaXZzKSB7XG5cbiAgICAgICAgLy8gZGl2LmNsYXNzTGlzdC5yZW1vdmUoXCJ1bmRlZmluZWRcIik7XG5cbiAgICAgICAgZGl2LnN0eWxlLm1hcmdpbkxlZnQgPSBudWxsO1xuXG4gICAgICAgIGRpdi5jbGFzc0xpc3QuZm9yRWFjaCgoaXRlbTogc3RyaW5nKT0+e1xuICAgICAgICAgICAgaWYoaXRlbS5zdGFydHNXaXRoKCdkYXRhXycpIHx8IGl0ZW0uc3RhcnRzV2l0aCgnaGVhZGluZ18nKSkge1xuICAgICAgICAgICAgICAgIGRpdi5jbGFzc0xpc3QucmVtb3ZlKGl0ZW0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuXG4gICAgfVxuXG59IiwgImltcG9ydCB7IEFwcCwgUGx1Z2luU2V0dGluZ1RhYiwgU2V0dGluZyB9IGZyb20gJ29ic2lkaWFuJztcbmltcG9ydCBIZWFkaW5nSW5kZW50IGZyb20gJy4vbWFpbic7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSGVhZGluZ0luZGVudFNldHRpbmdzIHtcblx0aDE6IHN0cmluZyxcblx0aDI6IHN0cmluZyxcblx0aDM6IHN0cmluZyxcblx0aDQ6IHN0cmluZyxcblx0aDU6IHN0cmluZyxcblx0aDY6IHN0cmluZyxcbn1cblxuZXhwb3J0IGNvbnN0IERFRkFVTFRfU0VUVElOR1M6IEhlYWRpbmdJbmRlbnRTZXR0aW5ncyA9IHtcblx0aDE6ICczMCcsXG5cdGgyOiAnNTAnLFxuXHRoMzogJzcwJyxcblx0aDQ6ICc5MCcsXG5cdGg1OiAnMTEwJyxcblx0aDY6ICcxMzAnLFxufVxuXG5leHBvcnQgY2xhc3MgSW5kZW50U2V0dGluZ1RhYiBleHRlbmRzIFBsdWdpblNldHRpbmdUYWIge1xuXHRwbHVnaW46IEhlYWRpbmdJbmRlbnQ7XG5cblx0Y29uc3RydWN0b3IoYXBwOiBBcHAsIHBsdWdpbjogSGVhZGluZ0luZGVudCkge1xuXHRcdHN1cGVyKGFwcCwgcGx1Z2luKTtcblx0XHR0aGlzLnBsdWdpbiA9IHBsdWdpbjtcblx0fVxuXG5cdGRpc3BsYXkoKTogdm9pZCB7XG5cdFx0Y29uc3Qge2NvbnRhaW5lckVsfSA9IHRoaXM7XG5cblx0XHRjb250YWluZXJFbC5lbXB0eSgpO1xuXG5cdFx0Y29udGFpbmVyRWwuY3JlYXRlRWwoJ2gyJywge3RleHQ6ICdTZXQgaWRlbnRhdGlvbnMgZm9yIGVhY2ggaGVhZGluZyAoaW4gcGl4ZWxzKSd9KTtcblxuXHRcdG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuXHRcdFx0LnNldE5hbWUoJ0gxIElkZW50YXRpb24nKVxuXHRcdFx0Ly8gLnNldERlc2MoJycpXG5cdFx0XHQvLyAuc2V0VG9vbHRpcCh0b29sdGlwOiBcImFzc2FkXCIpXG5cdFx0XHQuYWRkVGV4dChudW1iZXIgPT4gbnVtYmVyXG5cdFx0XHRcdC5zZXRQbGFjZWhvbGRlcignJylcblx0XHRcdFx0LnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLmgxKVxuXHRcdFx0XHQub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG5cdFx0XHRcdFx0Ly8gY29uc29sZS5sb2coJ1NlY3JldDogJyArIHZhbHVlKTtcblx0XHRcdFx0XHR0aGlzLnBsdWdpbi5zZXR0aW5ncy5oMSA9IHZhbHVlO1xuXHRcdFx0XHRcdGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuXHRcdFx0XHR9KSk7XG5cdFx0bmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG5cdFx0XHQuc2V0TmFtZSgnSDIgSWRlbnRhdGlvbicpXG5cdFx0XHQvLyAuc2V0RGVzYygnJylcblx0XHRcdC5hZGRUZXh0KHRleHQgPT4gdGV4dFxuXHRcdFx0XHQuc2V0UGxhY2Vob2xkZXIoJycpXG5cdFx0XHRcdC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5oMilcblx0XHRcdFx0Lm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuXHRcdFx0XHRcdC8vIGNvbnNvbGUubG9nKCdTZWNyZXQ6ICcgKyB2YWx1ZSk7XG5cdFx0XHRcdFx0dGhpcy5wbHVnaW4uc2V0dGluZ3MuaDIgPSB2YWx1ZTtcblx0XHRcdFx0XHRhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcblx0XHRcdFx0fSkpO1xuXHRcdG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuXHRcdFx0LnNldE5hbWUoJ0gzIElkZW50YXRpb24nKVxuXHRcdFx0Ly8gLnNldERlc2MoJycpXG5cdFx0XHQuYWRkVGV4dCh0ZXh0ID0+IHRleHRcblx0XHRcdFx0LnNldFBsYWNlaG9sZGVyKCcnKVxuXHRcdFx0XHQuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MuaDMpXG5cdFx0XHRcdC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcblx0XHRcdFx0XHQvLyBjb25zb2xlLmxvZygnU2VjcmV0OiAnICsgdmFsdWUpO1xuXHRcdFx0XHRcdHRoaXMucGx1Z2luLnNldHRpbmdzLmgzID0gdmFsdWU7XG5cdFx0XHRcdFx0YXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG5cdFx0XHRcdH0pKTtcblx0XHRuZXcgU2V0dGluZyhjb250YWluZXJFbClcblx0XHRcdC5zZXROYW1lKCdINCBJZGVudGF0aW9uJylcblx0XHRcdC8vIC5zZXREZXNjKCcnKVxuXHRcdFx0LmFkZFRleHQodGV4dCA9PiB0ZXh0XG5cdFx0XHRcdC5zZXRQbGFjZWhvbGRlcignJylcblx0XHRcdFx0LnNldFZhbHVlKHRoaXMucGx1Z2luLnNldHRpbmdzLmg0KVxuXHRcdFx0XHQub25DaGFuZ2UoYXN5bmMgKHZhbHVlKSA9PiB7XG5cdFx0XHRcdFx0Ly8gY29uc29sZS5sb2coJ1NlY3JldDogJyArIHZhbHVlKTtcblx0XHRcdFx0XHR0aGlzLnBsdWdpbi5zZXR0aW5ncy5oNCA9IHZhbHVlO1xuXHRcdFx0XHRcdGF3YWl0IHRoaXMucGx1Z2luLnNhdmVTZXR0aW5ncygpO1xuXHRcdFx0XHR9KSk7XG5cdFx0bmV3IFNldHRpbmcoY29udGFpbmVyRWwpXG5cdFx0XHQuc2V0TmFtZSgnSDUgSWRlbnRhdGlvbicpXG5cdFx0XHQvLyAuc2V0RGVzYygnJylcblx0XHRcdC5hZGRUZXh0KHRleHQgPT4gdGV4dFxuXHRcdFx0XHQuc2V0UGxhY2Vob2xkZXIoJycpXG5cdFx0XHRcdC5zZXRWYWx1ZSh0aGlzLnBsdWdpbi5zZXR0aW5ncy5oNSlcblx0XHRcdFx0Lm9uQ2hhbmdlKGFzeW5jICh2YWx1ZSkgPT4ge1xuXHRcdFx0XHRcdC8vIGNvbnNvbGUubG9nKCdTZWNyZXQ6ICcgKyB2YWx1ZSk7XG5cdFx0XHRcdFx0dGhpcy5wbHVnaW4uc2V0dGluZ3MuaDUgPSB2YWx1ZTtcblx0XHRcdFx0XHRhd2FpdCB0aGlzLnBsdWdpbi5zYXZlU2V0dGluZ3MoKTtcblx0XHRcdFx0fSkpO1xuXHRcdG5ldyBTZXR0aW5nKGNvbnRhaW5lckVsKVxuXHRcdFx0LnNldE5hbWUoJ0g2IElkZW50YXRpb24nKVxuXHRcdFx0Ly8gLnNldERlc2MoJycpXG5cdFx0XHQuYWRkVGV4dCh0ZXh0ID0+IHRleHRcblx0XHRcdFx0LnNldFBsYWNlaG9sZGVyKCcnKVxuXHRcdFx0XHQuc2V0VmFsdWUodGhpcy5wbHVnaW4uc2V0dGluZ3MuaDYpXG5cdFx0XHRcdC5vbkNoYW5nZShhc3luYyAodmFsdWUpID0+IHtcblx0XHRcdFx0XHQvLyBjb25zb2xlLmxvZygnU2VjcmV0OiAnICsgdmFsdWUpO1xuXHRcdFx0XHRcdHRoaXMucGx1Z2luLnNldHRpbmdzLmg2ID0gdmFsdWU7XG5cdFx0XHRcdFx0YXdhaXQgdGhpcy5wbHVnaW4uc2F2ZVNldHRpbmdzKCk7XG5cdFx0XHRcdH0pKTtcblx0fVxufSJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUEsdUJBQXFDOzs7QUNRckMsSUFBTSxvQkFBNEI7QUFFbEMsSUFBTSxxQkFBeUM7QUFBQSxFQUM5QyxHQUFHO0FBQUEsRUFDSCxHQUFHO0FBQUEsRUFDSCxHQUFHO0FBQUEsRUFDSCxHQUFHO0FBQUEsRUFDSCxHQUFHO0FBQUEsRUFDSCxHQUFHO0FBQUE7QUFHSixJQUFNLGlCQUFxQztBQUFBLEVBQzFDLEdBQUc7QUFBQSxFQUNILEdBQUc7QUFBQSxFQUNILEdBQUc7QUFBQSxFQUNILEdBQUc7QUFBQSxFQUNILEdBQUc7QUFBQSxFQUNILEdBQUc7QUFBQSxFQUNILEdBQUc7QUFBQTtBQXNCRyxpQ0FBaUMsUUFBc0I7QUFFMUQsTUFBSSxPQUFPLG9CQUFvQixRQUFVO0FBRXJDLFdBQU8sZ0JBQWdCO0FBQUE7QUFJM0IsUUFBTSxhQUFhLGVBQWUsY0FBYztBQUdoRCxNQUFJLGNBQWMsTUFBSztBQUNuQixZQUFRLElBQUk7QUFDWjtBQUFBO0FBSUosUUFBTSxTQUFTLEVBQUUsV0FBVztBQUc1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
