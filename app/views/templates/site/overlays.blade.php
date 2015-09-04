<?
/**
 * TEMPLATE_IS_NOT_SETTABLE
 */
?>
<div class="overlay js-overlay">
    <div class="overlay__background"></div>
    <div class="overlays">
        <div data-name="projects" class="js-popup overlay__block block-projects wrapper">
            <div class="projects-wrapper">
                <div class="projects-inside">
                    <div class="projects__top">
                        <a href="#" class="top__close js-close-popup"><span class="svg-font icon-close"></span></a>
                    </div>
                    <div class="projects__bottom">
                        <div class="bottom__left">
                            <div class="left__title">{{ trans("interface.menu_projects") }}</div>
                            <div class="left__nav">
                                <a href="#" class="nav__link us-link active">{{ trans("interface.filter_all") }}</a>
                                @if (count_($dic_types))
                                    @foreach ($dic_types as $type)
                                        <a href="#" class="nav__link us-link">{{ $type->field('type_name') }}</a>
                                    @endforeach
                                @endif
                            </div>
                            <div class="left__contact">
                                <a href="#" class="us-btn"><span>{{ trans("interface.button_contact_us") }}</span></a>
                            </div>
                        </div>
                        <div class="bottom__right js-customScroll">

                            <div class="block__upload">
                                <a href="#" class="upload__link"><span class="svg-font icon-download"></span><span class="link__text">{{ trans("interface.button_download_portfolio") }}</span></a>
                            </div>

                            {{--
                            <div class="block__item">
                                <div class="item__image"><img src="https://placeimg.com/285/285/any"></div>
                                <div class="item__tag">Digital</div>
                                <div class="item__name">Yandex</div>
                            </div>
                            --}}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</div>
