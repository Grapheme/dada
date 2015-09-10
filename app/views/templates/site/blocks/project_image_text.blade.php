<?php
Photo::preload($image);
?>

<section class="project__block block-text-image">
    <div class="wrapper">
        <div class="content-wrap">
            <div class="block__left right-pad">
                <div class="block-title">Cross-branding</div>
                <div class="block-desc">
                    {{ $text }}
                </div>
            </div>
            <div class="block__image">
                @if (isset($image) && is_object($image))
                    <div style="background-image: url({{ $image->full() }});" class="image__item left-pos"></div>
                @endif
            </div>
        </div>
    </div>
</section>
