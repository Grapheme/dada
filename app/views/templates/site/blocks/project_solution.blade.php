<?php
Photo::preload($image_big, $image_small);
?>

<section class="project__block block-solution">
    <div class="wrapper">
        <div class="content-wrap">
            <div class="block__left-text">Solution</div>
            <div class="block__left-image">
                @if (isset($image_big) && is_object($image_big))
                    <div style="background-image: url({{ $image_big->full() }});" class="image__item right-pos"></div>
                @endif
            </div>
            <div class="block__right left-pad">
                @if (isset($image_small) && is_object($image_small))
                    <div style="background-image: url({{ $image_small->full() }});" class="right__image"></div>
                @endif
                <div class="right__desc block-desc">
                    {{ $text }}
                </div>
            </div>
        </div>
    </div>
</section>
