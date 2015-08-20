<?php
Photo::preload($image_1, $image_2);
?>

<div>
    @if (isset($image_1) && is_object($image_1))
        <img src="{{ $image_1->full() }}" />
    @endif
    @if (isset($image_2) && is_object($image_2))
        <img src="{{ $image_2->full() }}" />
    @endif
</div>
<hr/>