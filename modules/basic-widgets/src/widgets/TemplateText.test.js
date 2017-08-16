(function () {
    "use strict";

    module("TemplateText");

    test("Content string setter", function () {
        expect(1);

        var templateText = $basicWidgets.TemplateText.create(),
            userNameField = 'user/1/name'.toField(),
            liveTemplate = "Hi {{name}}!".toLiveTemplate()
                .setParameterValues({
                    '{{name}}': userNameField
                });

        templateText.addMocks({
            _updateEntityBindings: function () {
                ok(true, "should update entity bindings");
            }
        });

        templateText.setContentString(liveTemplate);

        templateText.removeMocks();
    });

    test("Parameter value change handler", function () {
        expect(2);

        var templateText = $basicWidgets.TemplateText.create(),
            userNameField = 'user/Jane/name'.toField(),
            liveTemplate = "Hi {{name}}!".toLiveTemplate()
                .setParameterValues({
                    '{{name}}': userNameField
                });

        templateText.setContentString(liveTemplate);

        templateText.addMocks({
            _updateEntityBindings: function () {
                ok(true, "should update entity bindings");
            },
            reRenderContents: function () {
                ok(true, "should update DOM");
            }
        });

        liveTemplate.setParameterValues({
            '{{name}}': 'user/Bob/name'.toField()
        });

        templateText.removeMocks();
    });

    test("Field parameter change handler", function () {
        expect(1);

        var templateText = $basicWidgets.TemplateText.create(),
            userNameField = 'user/Jane/name'.toField().setValue("Jane"),
            liveTemplate = "Hi {{name}}!".toLiveTemplate()
                .setParameterValues({
                    '{{name}}': userNameField
                });

        templateText.setContentString(liveTemplate);

        templateText.addMocks({
            reRenderContents: function () {
                ok(true, "should update DOM");
            }
        });

        userNameField.setValue("Joanne");

        templateText.removeMocks();
    });

    test("Locale ready handler", function () {
        expect(1);

        var templateText = $basicWidgets.TemplateText.create(),
            userNameField = 'user/Jane/name'.toField().setValue("Jane"),
            liveTemplate = "Hi {{name}}!".toLiveTemplate()
                .setParameterValues({
                    '{{name}}': userNameField
                });

        'en'.toLocale()
            .markAsReady()
            .setAsCurrentLocale();

        'ja'.toLocale()
            .markAsReady();

        templateText.setContentString(liveTemplate);
        templateText.afterAdd();

        templateText.addMocks({
            reRenderContents: function () {
                ok(true, "should update DOM");
            }
        });

        'ja'.toLocale()
            .setAsCurrentLocale();

        templateText.removeMocks();
        templateText.afterRemove();
    });
}());
