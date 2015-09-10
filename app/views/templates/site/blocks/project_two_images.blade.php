<?php
Photo::preload($image_1, $image_2);
?>

<section class="project__block block-half-images">
    <div class="wrapper">
        <div class="content-wrap">
            <div class="block__image">
                @if (isset($image_1) && is_object($image_1))
                    <div style="background-image: url({{ $image_1->full() }});" class="image__item right-pos"></div>
                @endif
            </div>
            <div class="block__image">
                @if (isset($image_2) && is_object($image_2))
                    <div style="background-image: url({{ $image_2->full() }});" class="image__item left-pos"></div>
                @endif
            </div>
        </div>
    </div>
</section>
