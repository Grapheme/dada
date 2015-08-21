<?
/**
 * TITLE: Главная страница
 * AVAILABLE_ONLY_IN_ADVANCED_MODE
 */
?>
@extends(Helper::layout())
<?php
#$temp = Dic::valueBySlugAndId('equipments', 1);
#Helper::ta($temp);
?>


@section('style')
@stop


@section('content')

    <main class="main">
        <div class="index-sample js-index-sample"></div>
        <div class="index js-main-slider">
            <div class="wrapper">
                <div class="index-wrap">
                    <div style="background-image: url(images/tmp/index2.jpg);" class="index__slide js-slide"><a href="project.html" class="slide__link js-slide-link"></a>
                        <div class="slide__content">
                            <div class="project-title">Yandex.Music</div>
                            <div class="project-desc">Digital</div>
                        </div>
                    </div>
                    <div style="background-image: url(images/tmp/index.jpg);" class="index__slide js-slide"><a href="project.html" class="slide__link js-slide-link"></a>
                        <div class="slide__content">
                            <div class="project-title">Yandex.Music2</div>
                            <div class="project-desc">Digital</div>
                        </div>
                    </div>
                    <div style="background-image: url(images/tmp/index2.jpg);" class="index__slide js-slide"><a href="project.html" class="slide__link js-slide-link"></a>
                        <div class="slide__content">
                            <div class="project-title">Yandex.Music3</div>
                            <div class="project-desc">Digital</div>
                        </div>
                    </div>
                    <div style="background-image: url(images/tmp/index.jpg);" class="index__slide js-slide"><a href="project.html" class="slide__link js-slide-link"></a>
                        <div class="slide__content">
                            <div class="project-title">Yandex.Music4</div>
                            <div class="project-desc">Digital</div>
                        </div>
                    </div>
                    <div style="background-image: url(images/tmp/index2.jpg);" class="index__slide js-slide"><a href="project.html" class="slide__link js-slide-link"></a>
                        <div class="slide__content">
                            <div class="project-title">Yandex.Music5</div>
                            <div class="project-desc">Digital</div>
                        </div>
                    </div>
                    <div style="background-image: url(images/tmp/index.jpg);" class="index__slide js-slide"><a href="project.html" class="slide__link js-slide-link"></a>
                        <div class="slide__content">
                            <div class="project-title">Yandex.Music6</div>
                            <div class="project-desc">Digital</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>

@stop


@section('scripts')
@stop