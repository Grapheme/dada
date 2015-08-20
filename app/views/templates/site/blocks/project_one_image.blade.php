<?php
Photo::preload($image_1);
?>

<div>
    @if (isset($image_1) && is_object($image_1))
        <img src="{{ $image_1->full() }}" />
    @endif
</div>
<hr/>