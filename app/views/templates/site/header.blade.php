<?
/**
 * TEMPLATE_IS_NOT_SETTABLE
 */
?>

<header class="header">
    <div class="wrapper">

        <a href="{{ URL::route('mainpage') }}" class="header__logo" @if (trans("interface.logo_url")) style="background-image:url({{ trans("interface.logo_url") }})" @endif></a>

        <nav class="header__menu">
            <a href="#" class="menu__link"><span>Agency</span></a>
            <a href="#" class="menu__link"><span>Contacts</span></a>
            <a href="#" data-popup="projects" class="menu__projects js-show-popup"><span>Projects</span></a>
        </nav>

        {{ Menu::placement('main_menu') }}

    </div>
</header>
