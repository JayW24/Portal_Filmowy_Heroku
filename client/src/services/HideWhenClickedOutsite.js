import $ from 'jquery'

function HideWhenClickedOutside(selector) {
    $(document).ready(function () {
        $(document).click(function (event) {
            var clickover = $(event.target)
            var _opened = $(selector).hasClass("show")
            if ((_opened === true && !clickover.hasClass("navbar-toggle") && !clickover.hasClass("navbar-search") && !clickover.hasClass("fas fa-envelope"))) {
                $("#toggle").addClass("collapsed")
                $(selector).removeClass("show")
            }
        })
    })
}

export default HideWhenClickedOutside