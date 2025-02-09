#TODO
For A/B Tests, AA Tests, and Patch Tests, when a test is created, the targeting folder should be copied from the template and placed inside the test.

If the targeting folder is not available in the template, prompt the user to run ->  npm run cli init, or in another option automatically initialize it for them. Once initialized, the targeting folder will be available in the template, and it can then be copied into the test.

For Multi-Touch Tests, there are two key changes: The template no longer needs to create a separate structure for a multi-touch page since it will be simplified. so, creating multi touch template code will will be removed accordingly.


A multi-touch test consists of multiple or single touchpoints. Users can select their desired touchpoints, then create one or multiple variations. All touchpoints will share the same variation. Currently, this part is fully functional.

but the expected behavior is:

Each touchpoint should have a default variation named "Control."

For Multi-Touch Tests, copy of the targeting folder should be placed under the test name, similar to other test types. aldo Every touchpoint should receive a copy of the targeting folder from the template. Before copying, the system should validate whether the targeting template is available. If not, it should be initialized first and the same validation applies to variation templates, ensuring they exist before use in any type of test. validation for all kind of test


After setting up the test, the system should prompt the user to select an active variation:

In Multi-Touch Tests, selecting a variation (or "Control") will apply the same selection across all touchpoints.

In other test types, users can independently choose any variation or control.

Since multiple folders may exist inside a test or touchpoint, each JSON file inside a variation should include a variable that identifies it as a variation. This ensures clarity when displaying selectable variations.