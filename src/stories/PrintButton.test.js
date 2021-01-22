import { mount } from "@vue/test-utils";
import Hooks from "schemahandler/hooks/hooks";
import { inject, provide } from "vue";

describe("PrintButton test", function() {
  it("test render", async function() {
    const Test = {
      setup() {
        let hooks = inject("hooks");
        return () => {
          const field1 = <p>a</p>;
          const field2 = <p>b</p>;
          return hooks.emit("fields", field1, field2);
        };
      }
    };

    const Layout = {
      setup(props, context) {
        const hooks = new Hooks();
        provide("hooks", hooks);
        return () => {
          const a = context.slots.default(hooks);
          hooks.off("fields");
          hooks.on("fields", function(f1, f2) {
            this.setValue(
              <>
                <div class={"c1"}>{f1}</div>
                <div class={"c2"}>{f2}</div>
              </>
            );
          });
          return a;
        };
      }
    };

    const component = {
      components: {
        Layout,
        Test
      },
      setup() {
        return () => (
          <div>
            <layout>
              {{
                default: () => <test />
              }}
            </layout>
          </div>
        );
      }
    };
    const wrapper = mount(component, {
      props: {
        msg: "Hello World"
      }
    });

    expect(wrapper.html()).toMatchInlineSnapshot(
      `"<div msg=\\"Hello World\\"><div class=\\"c1\\"><p>a</p></div><div class=\\"c2\\"><p>b</p></div></div>"`
    );
  }, 80000);

  it("test render 2", async function() {
    const Test = {
      setup(props, context) {
        const hooks = new Hooks();
        provide("hooks", hooks);
        return () => {
          const field1 = <p>a</p>;
          const field2 = <p>b</p>;
          hooks.off("getFields");
          hooks.on("getFields", cb => cb(field1, field2));
          return context.slots.default();
        };
      }
    };

    //model + manifest

    const Layout = {
      setup(props, context) {
        let hooks = inject("hooks");
        return () => {
          let f1, f2;
          hooks.emit("getFields", function() {
            [f1, f2] = arguments;
          });
          return (
            <>
              <div class={"c1"}>{f1}</div>
              <div class={"c2"}>{f2}</div>
            </>
          );
        };
      }
    };

    const component = {
      components: {
        Layout,
        Test
      },
      setup() {
        return () => (
          <div>
            <test>
              <layout />
            </test>
          </div>
        );
      }
    };
    const wrapper = mount(component, {
      props: {
        msg: "Hello World"
      }
    });

    expect(wrapper.html()).toMatchInlineSnapshot(
      `"<div msg=\\"Hello World\\"><div class=\\"c1\\"><p>a</p></div><div class=\\"c2\\"><p>b</p></div></div>"`
    );
  }, 80000);
});
