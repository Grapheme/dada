<?php
Photo::preload($image_1);
?>

<section class="project__block block-big-image">
    <div class="wrapper">
        @if (isset($image_1) && is_object($image_1))
            <div class="content-wrap"><img src="{{ $image_1->full() }}" alt="" class="block__image"></div>
        @endif
    </div>
</section>
